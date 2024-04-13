/************************************************************************
 * Copyright 2020-2023 Ben Keppel                                        *
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

// This version of the server is for if lots of platypuss servers are to be
// hosted off the same device, in which case it makes more sense for them to
// share one node process to improve memory usage rather than all being
// separate. Platypuss is hosted off a single-core cpu so there is no
// advantage to multithreading, although if you have a multi-core cpu and
// plenty of ram then having separate processes may make more sense.

const { WebSocketServer } = require('ws');
const https = require('https');
const { readFileSync, readdirSync, writeFileSync, existsSync } = require("fs");
const path = require('path');
const { questionInt, question, keyInYN } = require("readline-sync");
const { randomInt } = require('crypto');

if (!existsSync(__dirname+"/servers.properties")) {
    let sata = {
        "sslCertPath": "./cert.pem",
        "sslKeyPath": "./key.pem"
    }
    sata[[randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)].join(".")] = {
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
    };
    writeFileSync(__dirname+"/servers.properties", JSON.stringify(sata));
    console.log("The server should now be set up nicely, although currently \
nobody has administrative permissions so you may want to edit the \
servers.properties file and add your Platypuss user ID there. You'll need to \
restart this server afterwards for the changes to be applied.");
}
var conf = JSON.parse(readFileSync(__dirname+"/servers.properties"));

if (!existsSync(__dirname+"/servers.json")) {
    let ide = {}
    ide[Object.keys(conf)[2]] = {
        "users": {},
        "rooms": {},
        "messages": {},
        "groups": {},
        "meta": {}
    }
    writeFileSync(__dirname+"/servers.json", JSON.stringify(ide));
}
var sdata = JSON.parse(readFileSync(__dirname+"/servers.json"));
sdata.properties = conf;
var handlers = {};
for (let server in conf) {
    if (sdata[server]) {
        sdata[server].properties = conf[server];
    } else {
        sdata[server] = {
            properties: conf.server[server],
            messages: {},
            rooms: {},
            groups: {},
            meta: {}
        };
    }
}
sdata.multiple = true;
const handlePath = path.join(__dirname, 'handles');
// we don't want to load README.md, any JSON config or platypussDefaults.js as they're all definitely not event handles
const handleFiles = readdirSync(handlePath).filter(file => file.endsWith('.js') && !file.includes("platypussDefaults"));
const sslCert = readFileSync(conf.sslCertPath);
const sslKey = readFileSync(conf.sslKeyPath);
for (const file of handleFiles) {
    const filePath = path.join(handlePath, file);
    var handler = require(filePath);
    handler.name = file;
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
    let url = new URL(req.url, req.headers.host);
    if (conf.manifests[url.pathname.replace(/\//g, "")]) {
        let o = conf.manifests[url.pathname.replace(/\//g, "")];
        o.memberCount = Object.keys(sdata.users).length;
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        res.end(JSON.stringify(o));
    } else {
        res.writeHead(403, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.end("not found");
    }
});

httpser.listen(conf.port, () => {
    const wss = new WebSocketServer({ clientTracking: true, server: httpser });

    wss.on('connection', function connection(ws) {
        ws.loggedinbytoken = false;
        ws.ogip = "127.0.0.1";
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
                    if (eventType === "login" && eventType in handlers) {
                        if (!packet.ogip) {
                            packet.ws.send(JSON.stringify({
                                eventType: "error",
                                code: "missingSubserverID",
                                explanation: "This server serves multiple \
subservers through the same port. You need to specify which subserver to \
join using the 'ogip' parameter, which is normally the first 8 characters \
of the invite code."
                            }));
                            return;
                        }
                        if (!(packet.ogip in conf)) {
                            packet.ws.send(JSON.stringify({
                                eventType: "error",
                                code: "nonExistent",
                                explanation: "That subserver does not exist."
                            }))
                            return;
                        }
                        ws.ogip = packet.ogip;
                    }
                    if (eventType in handlers) {
                        for (let handler of handlers[eventType]) {
                            // we can prevent certain subservers from recieving certain events
                            if (sdata[ws.ogip].handlerBlacklist)
                                if (sdata[ws.ogip].handlerBlacklist.includes(handler.name))
                                    continue;
                            packet.ws = ws;
                            let ret = handler.execute(sdata[ws.ogip], wss, packet);
                            if (ret) sdata[ws.ogip] = ret;
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
                    writeFileSync(__dirname+"/servers.json", JSON.stringify(sdata));
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
            writeFileSync(__dirname+"/servers.json", JSON.stringify(sdata));
            https.get(`https://${sdata[ws.ogip].properties.authAddr}/uinfo?id=${ws.uid}`, (res) => {
                let chunks = [];
                res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                res.on('error', (err) => reject(err));
                res.on('end', () => {
                    let data;
                    try {
                        data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                        for (let client of wss.clients) {
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
for (let part of Object.keys(conf)[2].split(".")) {
    cp = parseInt(part, 10).toString(16);
    while (cp.length < 2) {
        cp = "0" + cp;
    }
    code += cp;
}
// the invite code must be at least 16
code += parseInt(conf[Object.keys(conf)[2]], 10).toString(16) + parseInt(conf[Object.keys(conf)[2]].inviteCode, 10).toString(16);
inviteUrl = `https://platypuss.net/chat?invite=${code}&invip=localhost`;

console.log(`The server is currently running on port ${conf[Object.keys(conf)[2]].port}, join at ${inviteUrl}`);
