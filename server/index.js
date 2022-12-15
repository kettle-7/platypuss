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
const { readFileSync, writeFile, readFile, readdirSync } = require("fs");
const path = require('path');
var conf = JSON.parse(readFileSync(__dirname+"/server.properties"));
var handlers = {};
const handlePath = path.join(__dirname, 'handles');
const handleFiles = readdirSync(handlePath).filter(file => file.endsWith('.js'));
for (const file of handleFiles) {
	const filePath = path.join(handlePath, file);
	const handler = require(filePath);
	if ('event' in handler && 'execute' in handler) {
		if (handler.event in handlers) {
            handlers[handler.event].push(handler);
        }
        else {
            handlers[handler.event] = [handler];
        }
	} else {
        console.log(`Warning: event handle file ${filePath} is missing event or execute attribute`);
    }
}

const wss = new WebSocketServer({ port: conf.port, clientTracking: true });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        try {
            let obj = JSON.parse(data);
            let eventType = obj.eventType;
        }
        catch {
            ws.send(JSON.stringify({
                eventType: "error",
                code: "invalidJson",
                explanation: 
"The JSON data recieved in the previous packet was invalid or had no eventType prop\
erty. If you are the developer of the client that sent the packet please check\
 your code thoroughly, otherwise please contact the developer."
            }));
            return;
        }
        if (eventType in handlers) {
            for (let handler of handlers[eventType]) {
                handler.execute(obj);
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
    });
    ws.send(JSON.stringify({
        eventType: "connected",
        explanation: "You have successfully connected to the server!"
    }));
});