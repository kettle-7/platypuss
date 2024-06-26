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
    eventType: "createCallRoom",
    execute: function (sdata, wss, packet, clients) {
        if (!wss.callRooms) {
            wss.callRooms = {};
        }
        if (packet.ws.inCall) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "alreadyInCall",
                "explanation": "You're already in a call."
            }));
            return;
        }
        if (!packet.callName) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "missingData",
                "explanation": "You need to send an ID for this call, also please make it unique."
            }));
            return;
        }
        if (wss.callRooms[packet.callname]) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "nonUniqueCallID",
                "explanation": "Someone's already in a call with that ID."
            }));
            return;
        }
        wss.callRooms[packet.callName] = {
            offer: packet.offer,
            callerCandidates: [],
            calleeCandidates: [],
            caller: packet.ws.uid,
            name: packet.callName
        };
        packet.ws.inCall = packet.callName;
        packet.ws.send(JSON.stringify({
            "eventType": "callData",
            "callData": wss.callRooms[packet.callName]
        }));
        return;
    }
};
 