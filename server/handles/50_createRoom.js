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

 const { Room } = require("./platypussDefaults.js");
 const { v4 } = require('uuid');

 module.exports = {
	eventType: "createRoom",
	execute: function (sdata, wss, packet, clients) {
        if (packet.name == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingRoomName",
                explanation: "createRoom event requires a name for the room to be created"
            }));
            return;
        }
        if (!(sdata.users[packet.ws.uid].globalPerms.includes("room.add") || sdata.properties.admins.includes(packet.ws.uid))) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPerm",
                explanation: "you can't do that"
            }));
            return;
        }
        let newRoomId = v4();
        sdata.rooms[newRoomId] = new Room(newRoomId, packet.name.toString());
        for (let client of clients) {
            if (client.loggedinbytoken)
            client.send(JSON.stringify({
                eventType: "roomAdded",
                id: newRoomId,
                room: sdata.rooms[newRoomId]
            }));
        }
        return sdata;
    }
};
