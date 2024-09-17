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
const fs = require("fs");
const path = require('path');
// feel free to comment out this line if you already have a config and don't want extra packages to install
const { questionInt, question, keyInYN } = require("readline-sync");
const { randomInt, createHash } = require('crypto');
const { maximumFileSize } = require('./handles/platypussDefaults');
const { v4 } = require("uuid");

if (!fs.existsSync(__dirname+"/servers.properties")) {
    let sata = {
        "port": questionInt("What port should the server bind to?\n> "),
        "sslCertPath": "./cert.pem",
        "sslKeyPath": "./key.pem"
    }
    sata[[randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)].join(".")] = {
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
    fs.writeFileSync(__dirname+"/servers.properties", JSON.stringify(sata));
    console.log("The server should now be set up nicely, although currently \
nobody has administrative permissions so you may want to edit the \
servers.properties file and add your Platypuss user ID there. You'll need to \
restart this server afterwards for the changes to be applied.");
}
var conf = JSON.parse(fs.readFileSync(__dirname+"/servers.properties"));

if (!fs.existsSync(__dirname+"/servers.json")) {
    let ide = {}
    ide[Object.keys(conf)[2]] = {
        "users": {},
        "rooms": {},
        "messages": {},
        "groups": {},
        "meta": {}
    }
    fs.writeFileSync(__dirname+"/servers.json", JSON.stringify(ide));
}
var sdata = JSON.parse(fs.readFileSync(__dirname+"/servers.json"));
sdata.properties = conf;
var handlers = {};
var clientses = {};
for (let server in conf) {
    if (conf[server].authAddr == undefined) continue;
    if (conf[server].ogip == undefined) conf[server].ogip = server;
    conf[server].authAddr = `https://${conf[server].authAddr.replace(/http(s|)\:\/\//g, "")}`;
    clientses[server] = [];
    if (sdata[server]) {
        sdata[server].properties = conf[server];
    } else {
        sdata[server] = {
            multiple: true,
            properties: conf[server],
            messages: {},
            rooms: {},
            groups: {},
            meta: {},
            users: {},
        };
    }
}
// insanity check
fs.writeFileSync(__dirname+"/servers.json", JSON.stringify(sdata));
sdata.multiple = true;
sdata.tls = true;
const handlePath = path.join(__dirname, 'handles');
// we don't want to load README.md, any JSON config or platypussDefaults.js as they're all definitely not event handles
const handleFiles = fs.readdirSync(handlePath).filter(file => file.endsWith('.js') && !file.includes("platypussDefaults"));
const sslCert = fs.readFileSync(conf.sslCertPath);
const sslKey = fs.readFileSync(conf.sslKeyPath);
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
    try {
        let url = new URL(req.url, `https://${req.headers.host}`);
        if (conf[url.pathname.replace(/\//g, "")]) {
            let o = conf[url.pathname.replace(/\//g, "")].manifest;
            o.memberCount = Object.keys(sdata[url.pathname.replace(/\//g, "")].users).length;
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            });
            res.end(JSON.stringify(o));
        } else if (url.pathname == "/upload") {
            if (!url.searchParams.has("sessionID")) {
                res.writeHead(403, {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                });
                res.end("No session token was provided for the uploading user.");
                return;
            }
            let mimeType = "text/plain";
            if (url.searchParams.has("mimeType")) {
                mimeType = decodeURIComponent(url.searchParams.get("mimeType"));
            }
            let fileName = "file";
            if (url.searchParams.has("fileName")) {
                fileName = decodeURIComponent(url.searchParams.get("fileName"));
            }
            let sessionID = url.searchParams.get("sessionID");
            let userID = false;
            let subserver = "";
            // lets us look up the id of the user trying to upload a file without having to contact the authentication
            // server, also comes with the added benefit of not accepting users who aren't currently online or in the server
            for (let sub of Object.keys(clientses)) {
                for (let socket of clientses[sub]) {
                    if (socket.sessionID === sessionID) {
                        userID = socket.uid;
                        subserver = sub;
                        break;
                    }
                }
            }
            if (!userID) {
                res.writeHead(403, {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                });
                res.end("The session token provided isn't in use by any client currently connected to the server.");
                return;
            }
            let received = 0;
            fs.mkdirSync(`./usercontent/uploads/${userID}/`, {recursive: true})
            let filePath = `./usercontent/uploads/${userID}/temp_${v4()}`;
            let file = fs.createWriteStream(filePath);
            req.on("data", (buffer) => {
                received += buffer.length;
                if (received > maximumFileSize) {
                    req.destroy();
                } else {
                    file.write(buffer);
                }
            });
            req.on("end", () => {
                file.close();
                let fileData = fs.readFileSync(filePath);
                let hash = createHash('sha512').update(fileData).digest("hex");
                let newPath = `./usercontent/uploads/${userID}/${hash}/`;
                fs.mkdirSync(`${newPath}`, {recursive: true});
                // remove spaces (because we can't have them in urls) and null characters (because it's a good idea to)
                newPath += path.basename(fileName.toString().replace(/ \0/g, "_"));
                fs.renameSync(filePath, newPath);
                if (sdata[subserver].users[userID].uploadedFiles === undefined) {
                    sdata[subserver].users[userID].uploadedFiles == [{url: newPath.replace("./usercontent", ""), type: mimeType, name: fileName, path: "/", public: true}];
                } else {
                    sdata[subserver].users[userID].uploadedFiles.push({url: newPath.replace("./usercontent", ""), type: mimeType, name: fileName, path: "/", public: true});
                }
                res.writeHead(200, {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                });
                res.end(JSON.stringify({url: newPath.replace("./usercontent", ""), type: mimeType, name: path.basename(fileName)}));
            });
            return;
        } else if (url.pathname.startsWith("/uploads")) {
            url.pathname = url.pathname.replace(/\.\./g, "");
            if (!fs.existsSync("./usercontent"+url.pathname)) {
                res.writeHead(404, "not found", { "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*" });
                res.end("that file couldn't be found or you don't have permission to see it\n\n"+url.pathname);
                return;
            }

            if (fs.lstatSync("./usercontent"+url.pathname).isDirectory()) {
                /*if (!url.searchParams.has('id')) {*/
                    res.writeHead(201, {"Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"});
                    res.end("that's a folder");
                    return;
                /*}
                res.writeHead(200, { "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" });
                try {
                    // i have no memory of what the hell this is meant to be
                    res.end(JSON.stringify(fs.readdirSync(`./usercontent/uploads/${sessions[sid].uid}/`)));
                } catch (e) {
                    console.error(e);
                    res.end('[]');
                }
                return;*/
            }

            let stream = fs.createReadStream("./usercontent"+url.pathname);
            res.writeHead(200, {"Access-Control-Allow-Origin": "*", 'Content-disposition': `attachment; filename=${path.basename(url.pathname)}`});
            stream.on("ready", () => {
                stream.pipe(res);
            });
            return;
        } else {
            res.writeHead(404, "not found", {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"
            });
            res.end("not found");
        }
    } catch (e) {
        console.error(e);
        res.writeHead(502, {
            "Access-Control-Allow-Origin": "*"
        })
        res.end("oops that did work\n\n"+e.toString());
    }
});

httpser.listen(conf.port, () => {
    const wss = new WebSocketServer({ clientTracking: false, server: httpser });

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
                        if (!packet.subserver) {
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
                        
                        if (!(packet.subserver in conf)) {
                            ws.send(JSON.stringify({
                                eventType: "error",
                                code: "nonExistent",
                                explanation: "That subserver does not exist."
                            }))
                            return;
                        }
                        if (clientses[ws.ogip] === undefined) {
                            clientses[ws.ogip] = [];
                        }
                        ws.ogip = packet.subserver;
                        clientses[ws.ogip].push(ws);
                    }
                    if (eventType in handlers) {
                        for (let handler of handlers[eventType]) {
                            // we can prevent certain subservers from recieving certain events
                            if (sdata[ws.ogip].handlerBlacklist)
                                if (sdata[ws.ogip].handlerBlacklist.includes(handler.name))
                                    continue;
                            packet.ws = ws;
                            packet.servers = sdata;
                            let ret = handler.execute(sdata[ws.ogip], wss, packet, clientses[ws.ogip]);
                            sdata = packet.servers;
                            if (ret) {
                                sdata[ws.ogip] = ret;
                            }
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
                    fs.writeFileSync(__dirname+"/servers.json", JSON.stringify(sdata));
                    fs.writeFileSync(__dirname+"/servers.properties", JSON.stringify(sdata.properties));
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
            fs.writeFileSync(__dirname+"/servers.json", JSON.stringify(sdata));
            fs.writeFileSync(__dirname+"/servers.properties", JSON.stringify(sdata.properties));
            https.get(`${sdata[ws.ogip].properties.authAddr}/uinfo?id=${ws.uid}`, (res) => {
                let chunks = [];
                res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                res.on('error', (err) => reject(err));
                res.on('end', () => {
                    let data;
                    try {
                        data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                        for (let client of clientses[ws.ogip]) {
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
// finally fixed the invite code needing to be at least 16, although i'd reccommend keeping it above 16 just in case
code += parseInt(conf.port, 10).toString(16) + parseInt(conf[Object.keys(conf)[2]].inviteCode, 10).toString(16).padStart(2, "0");
inviteUrl = `https://platypuss.net/chat?invite=${code}&invip=localhost`;

console.log(`The server is currently running on port ${conf.port}, join at ${inviteUrl}`);
