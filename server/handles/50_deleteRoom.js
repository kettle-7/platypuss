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

 const { } = require("./platypussDefaults.js");
 const { v4 } = require('uuid');

 module.exports = {
	eventType: "deleteRoom",
	execute: function (sdata, wss, packet, clients) {
        if (packet.roomID == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingRoomID",
                explanation: "deleteRoom event requires an ID for the room to be deleted"
            }));
            return;
        }
        if (!(sdata.users[packet.ws.uid].globalPermissions.includes("room.delete") || sdata.properties.admins.includes(packet.ws.uid))) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPerm",
                explanation: "you can't do that"
            }));
            return;
        }
        if (!sdata.rooms[packet.roomID]) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "nonExistentRoom",
                explanation: "no room by that ID exists"
            }));
            return;
        }
        delete sdata.rooms[packet.roomID];
        let newRooms = {};
        for (let room of Object.values(sdata.rooms)) {
            // TODO: permissions
            newRooms[room.id] = {
                id: room.id,
                name: room.name,
                messages: {}
            }
        }
        for (let client of clients) {
            if (client.loggedinbytoken)
            client.send(JSON.stringify({
                eventType: "roomDeleted",
                id: packet.roomID,
                newRooms: newRooms
            }));
        }
        return sdata;
    }
};
