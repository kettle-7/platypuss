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
	eventType: "editRoom",
	execute: function (sdata, wss, packet, clients) {
        if (packet.roomID == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingRoomID",
                explanation: "editRoom event requires an ID for the room to be edited"
            }));
            return;
        }
        if (packet.operation == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingRoomOperation",
                explanation: "editRoom event requires an operation field for what will be changed"
            }));
            return;
        }
        if (!(sdata.users[packet.ws.uid].globalPermissions.includes("room.edit") || sdata.properties.admins.includes(packet.ws.uid))) {
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
        switch (packet.operation) {
            case "rename":
                if (!packet.newName) {
                    packet.ws.send(JSON.stringify({
                        eventType: "error",
                        code: "missingData",
                        explanation: "you need a new name for the room"
                    }));
                    return sdata;
                }
                sdata.rooms[packet.roomID].name = packet.newName.toString();
                break;
            case "changeDescription":
                if (!packet.newDescription) {
                    packet.ws.send(JSON.stringify({
                        eventType: "error",
                        code: "missingData",
                        explanation: "you need a new description for the room"
                    }));
                    return sdata;
                }
                sdata.rooms[packet.roomID].description = packet.newDescription.toString();
                break;
            default:
                packet.ws.send(JSON.stringify({
                    eventType: "error",
                    code: "invalidOperation",
                    explanation: "this server does not support the requested operation"
                }));
                return;
        }
        let newRooms = {};
        for (let room of Object.values(sdata.rooms)) {
            // TODO: permissions
            newRooms[room.id] = {
                id: room.id,
                name: room.name,
                description: room.description,
                messages: {}
            }
        }
        for (let client of clients) {
            if (client.loggedinbytoken)
            client.send(JSON.stringify({
                eventType: "roomEdited",
                id: packet.roomID,
                room: sdata.rooms[packet.roomID],
                newRooms: newRooms
            }));
        }
        return sdata;
    }
};
