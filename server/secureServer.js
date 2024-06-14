 /************************************************************************
 * Copyright 2024 Ben Keppel                                             *
 *                                                                       *
 * This program is free software: you can redistribute it and/or modify  *
 * it under the terms of the GNU General Public License as published by  *
 * the Free Software Foundation, either version 3 of the License, or     *
 * (at your option) any later version.                                   *
 *                                                                       *
 * This program is distributed in the hope that it will be useful,       *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 * GNU General Public License for more details.                          *
 *                                                                       *
 * You should have received a copy of the GNU General Public License     *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. *
 ************************************************************************/

const { WebSocketServer } = require('ws');
const https = require('https');
const { readFileSync, readdirSync, writeFileSync, existsSync } = require("fs");
const path = require('path');
const { questionInt, question, keyInYN } = require("readline-sync");
const { randomInt } = require('crypto');

if (!existsSync(__dirname+"/server.properties")) {
    writeFileSync(__dirname+"/server.properties", JSON.stringify({
        "sslCertPath": question("Please put in the path to your SSL certificate:\n> "),
        "sslKeyPath": question("Also the private key please:\n> "),
        "port": questionInt("What port should the server bind to?\n> "),
        "inviteCode": randomInt(16, 256),
        "ip": "127.0.0.1",
        "authAddr": "https://platypuss.net",
        "manifest": {
            "title": question("What would you like to name the server?\n> "),
            "public": keyInYN("Will the server be public? "),
            "icon": question("Please put in an image link for the server icon or leave blank for the default.\n> ", {defaultInput: "./icon.png"}),
            "memberCount": 0,
            "description": question("In one line how would you describe the server? This will show up on the invite page.\n> ")
        },
        "admins": []
    }));
    console.log("The server should now be set up nicely, although currently \
nobody has administrative permissions so you may want to edit the \
server.properties file and add your Platypuss user ID there. You'll need to \
restart this server afterwards for the changes to be applied.");
}

var conf = JSON.parse(readFileSync(__dirname+"/server.properties"));

if (!existsSync(__dirname+"/server.json")) {
    writeFileSync(__dirname+"/server.json", JSON.stringify({
        "users": {},
        "rooms": {},
        "messages": {},
        "groups": {},
        "meta": {}
    }));
}

var sdata = JSON.parse(readFileSync(__dirname+"/server.json"));
sdata.properties = conf;
sdata.tls = true;
var clients = [];
var handlers = {};
const handlePath = path.join(__dirname, 'handles');
// we don't want to load README.md, any JSON config or platypussDefaults.js as they're all definitely not event handles
const handleFiles = readdirSync(handlePath).filter(file => file.endsWith('.js') && !file.includes("platypussDefaults"));
const sslCert = readFileSync(conf.sslCertPath);
const sslKey = readFileSync(conf.sslKeyPath);
for (const file of handleFiles) {
	const filePath = path.join(handlePath, file);
	const handler = require(filePath);
	if ('eventType' in handler && 'execute' in handler) {
		if (handler.eventType in handlers) {
            handlers[handler.eventType].push(handler);
        }
        else {
            handlers[handler.eventType] = [handler];
        }
	} else {
        console.log(`Warning: event handle file ${filePath} is missing eventType or execute attribute`);
    }
}

const httpser = https.createServer({
    cert: sslCert, key: sslKey
}, (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    let o = conf.manifest;
    o.memberCount = Object.keys(sdata.users).length;
    res.end(JSON.stringify(o));
});

httpser.listen(conf.port, () => {
    const wss = new WebSocketServer({ clientTracking: false, server: httpser });

    wss.on('connection', function connection(ws) {
        ws.loggedinbytoken = false;
        clients.push(ws);
        ws.on('message', function message(data) {
            try {
                let packet = JSON.parse(data);
                let eventType = packet.eventType;
                try {
                    if (!ws.loggedinbytoken && eventType != "login") {
                        ws.send(JSON.stringify({
                            eventType: "error",
                            code: "notLoggedIn",
                            explanation: 
"This server requires a session token to be passed in order for any packets to\
 be accepted. If you are the developer of the client then please add sign-in\
 functionality."
                        }));
                        return;
                    }
                    if (eventType in handlers) {
                        for (let handler of handlers[eventType]) {
                            packet.ws = ws;
                            sdata.properties = conf;
                            let ret = handler.execute(sdata, wss, packet, clients);
                            if (ret) sdata = ret;
                            ws = packet.ws;
                        }
                    } else {
                        ws.send(JSON.stringify({
                            eventType: "error",
                            code: "unknownEvent",
                            explanation: 
"The server did not recognise the event type sent in the last packet, it may be\
 incomplete, using an outdated version of the API, or the client sent a faulty\
 packet. The only way to be sure which end is at fault is by checking the API\
 reference docs to see what event types should be supported."
                        }));
                        console.log(`\
The server did not recognise the event type sent in the last packet, it may be\
 using an outdated version of the API, incomplete, or the client sent a faulty\
 packet. The only way to be sure which end is at fault is by checking the API\
 reference docs to see what event types should be supported.\n\nEvent type give\
n: ${eventType}\n`);
                    }
                } catch (e) {
                    writeFileSync(__dirname+"/server.json", JSON.stringify(sdata));
                    console.log (e);
                }
            }
            catch {
                ws.send(JSON.stringify({
                    eventType: "error",
                    code: "invalidJson",
                    explanation: 
"The JSON data recieved in the previous packet was invalid or had no eventType\
 property. If you are the developer of the client that sent the packet please \
check your code thoroughly, otherwise please contact the developer."
                }));
                return;
            }
        });
        ws.send(JSON.stringify({
            eventType: "connecting",
            explanation: "Connecting..."
        }));
        ws.on("error", console.log);
        ws.on("close", () => {
            writeFileSync(__dirname+"/server.json", JSON.stringify(sdata));
            ws.readyState = 3;
            for (let client of clients) {
                if (client.readyState < 2 && client.uid == ws.uid) {
                    return; // don't tell others they disconnected if they have another client still connected
                }
            }
            https.get(`${sdata.properties.authAddr}/uinfo?id=${ws.uid}`, (res) => {
                let chunks = [];
                res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                res.on('error', (err) => reject(err));
                res.on('end', () => {
                    let data;
                    try {
                        data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                        for (let client of clients) {
                            if (client != ws && client.loggedinbytoken)
                            client.send(JSON.stringify({
                                eventType: "disconnect",
                                user: ws.uid,
                                explanation: `${data.unam} disconnected from the server.`
                            }));
                        }
                        console.log(data.unam + " disconnected from the server.");
                    } catch (e) {
                        console.log(e, Buffer.concat(chunks).toString('utf8'));
                        console.log(ws.uid + " disconnected from the server.");
                    }
                });
            });
        });
    });
    wss.on("error", console.log);
});

let code = "";
for (let part of conf.ip.split(".")) {
    cp = parseInt(part, 10).toString(16);
    while (cp.length < 2) {
    	cp = "0" + cp;
    }
    code += cp;
}
// the invite code must be at least 16
code += parseInt(conf.port, 10).toString(16) + parseInt(conf.inviteCode, 10).toString(16);
inviteUrl = `https://platypuss.net/chat?invite=${code}`;

console.log(`The server is currently running on port ${conf.port}, join at ${inviteUrl}`);
