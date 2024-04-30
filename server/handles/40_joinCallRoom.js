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
    eventType: "joinCallRoom",
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
                "explanation": "You need to send an ID for the call to join."
            }));
            return;
        }
        if (!wss.callRooms[packet.callname]) {
            console.log(wss.callRooms);
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "nonexistentCall",
                "explanation": "That call doesn't exist."
            }));
            return;
        }
        if (wss.callRooms[packet.callName].callee) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "callFull",
                "explanation": "There's already two people in that call."
            }));
            return;
        }
        packet.ws.inCall = packet.callName;
        ws.callRooms[packet.callName].callee = packet.ws.uid;
        packet.ws.send(JSON.stringify({
            "eventType": "callData",
            "callData": wss.callRooms[packet.callName]
        }));
        return;
    }
};
