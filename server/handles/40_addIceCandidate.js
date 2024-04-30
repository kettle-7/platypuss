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
    eventType: "addIceCandidate",
    execute: function (sdata, wss, packet, clients) {
        if (!wss.callRooms) {
            wss.callRooms = {};
        }
        if (!packet.ws.inCall) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "notInCall",
                "explanation": "You're not in a call."
            }));
            return;
        }
        if (!wss.callRooms[packet.ws.inCall]) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "notInCall",
                "explanation": "You're not in that call."
            }));
            return;
        }
        if (!packet.newCandidate) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "missingData",
                "explanation": "The packet was missing an ICE candidate to add."
            }));
            return;
        }
        if (wss.callRooms[packet.ws.inCall].caller === packet.ws.uid) {
            wss.callRooms[packet.ws.inCall].callerCandidates.push(packet.newCandidate);
            for (let client of clients) {
                if (client.inCall === packet.ws.inCall && client.uid !== packet.ws.uid) {
                    client.send(JSON.stringify({
                        eventType: "newIceCandidate",
                        type: "callerCandidate",
                        candidate: packet.newCandidate
                    }));
                }
            }
        } else if (wss.callRooms[packet.ws.inCall].callee === packet.ws.uid) {
            wss.callRooms[packet.ws.inCall].calleeCandidates.push(packet.newCandidate);
            for (let client of clients) {
                if (client.inCall === packet.ws.inCall && client.uid !== packet.ws.uid) {
                    client.send(JSON.stringify({
                        eventType: "newIceCandidate",
                        type: "calleeCandidate",
                        candidate: packet.newCandidate
                    }));
                }
            }
        } else {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "notInCall",
                "explanation": "You're not in that call."
            }));
            return;
        }
        packet.ws.send(JSON.stringify({
            "eventType": "callData",
            "callData": sdata.callRooms[packet.ws.inCall]
        }));
        return sdata;
    }
};
