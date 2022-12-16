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

const { WebSocketServer } = require('ws');
const { readFileSync, writeFile, readFile, readdirSync, writeFileSync } = require("fs");
const path = require('path');
const { eventType } = require('./handles/50_message');
var conf = JSON.parse(readFileSync(__dirname+"/server.properties"));
var sdata = JSON.parse(readFileSync(__dirname+"/server.json"));
sdata.properties = conf;
var handlers = {};
const handlePath = path.join(__dirname, 'handles');
// we don't want to load README.md, any JSON config or platypussDefaults.js as they're all definitely not event handles
const handleFiles = readdirSync(handlePath).filter(file => file.endsWith('.js') && !file.includes("platypussDefaults"));
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

const wss = new WebSocketServer({ port: conf.port, clientTracking: true });

wss.on('connection', function connection(ws) {
    ws.loggedinbytoken = false;
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
                        let ret = handler.execute(sdata, wss, packet);
                        if (ret) sdata = ret;
                        ws = packet.ws;
                    }
                } else {
                    ws.send(JSON.stringify({
                        eventType: "error",
                        code: "unknownEvent",
                        explanation: 
"The server did not recognise the event type sent in the last packet, it may be\
 using an outdated version of the API, incomplete, or the client sent a faulty\
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
    ws.on("close", console.log);
});
wss.on("error", console.log);
wss.on("close", console.log);

let code = "";
for (let part of conf.ip.split(".")) {
    code += parseInt(part, 10).toString(16);
}
code += parseInt(conf.port, 10).toString(16) + parseInt(conf.inviteCode, 10).toString(16);
inviteUrl = `http://122.62.122.75:3000/?invite=${code}`;

console.log(`The server is currently running on port ${conf.port}, join at ${inviteUrl}`);