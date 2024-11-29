 /************************************************************************
 * Copyright 2020-2024 Ben Keppel                                        *
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

const { v4 } = require("uuid");
const { } = require("./platypussDefaults.js"); // import nothing :o)

module.exports = {
    eventType: "joinCall",
    execute: function (sdata, wss, packet, clients) {
        if (!sdata.callers) {
            sdata.callers = [];
        }
        packet.ws.send(JSON.stringify({
            eventType: "debug",
            explanation: "p"
        }));
        if (packet.ws.inCall) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "alreadyInCall",
                explanation: "You're already in a call."
            }));
            return;
        }
        packet.ws.inCall = true;
        packet.ws.send(JSON.stringify({
            eventType: "debug",
            explanation: "a"
        }));
        let callPeers = {};
        for (let caller of sdata.callers) {
            let id = v4();
            callPeers[caller.uid] = id;
            caller.send({
                eventType: "newCallPeer",
                user: callPeers.uid,
                id: id
            });
        }
        packet.ws.send(JSON.stringify({
            eventType: "debug",
            explanation: "b"
        }));
        sdata.callers.push(packet.ws);
        packet.ws.send(JSON.stringify({
            eventType: "callJoined",
            callPeers: callPeers,
            explanation: JSON.stringify(sdata.callers)
        }));
        return;
    }
};
