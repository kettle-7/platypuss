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

const { } = require("./platypussDefaults.js");

module.exports = {
    eventType: "messageLoad",
    execute: function (sdata, wss, packet) {
        if (!(sdata.users[packet.ws.uid].globalPermissions.includes("message.history") && sdata.users[packet.ws.uid].globalPermissions.includes("message.read"))) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPerm",
                explanation: "You can't do that"
            }));
            return;
        }
        if (sdata.rooms[packet.room] == undefined) {
            packet.ws.send(JSON.stringify({
                "eventType": "error",
                "code": "nonexistentRoom",
                "explanation": "This server does not contain a room by that ID."
            }));
            console.log(packet.room);
            return;
        }
        let max = 20;
        let start = 0;
        if (packet.max != undefined)
            max = packet.max;
        if (packet.start != undefined)
            start = packet.start;
        let msgstld = [];
        let mids = Object.keys(sdata.rooms[packet.room].messages);
        for (let i = mids.length - max - start; i < mids.length - start; i++) { // this acts weirdly when no messages have been sent
            while (i < 0) i++;
            msgstld.push(sdata.rooms[packet.room].messages[mids[i]]);
        }
        let done = (max + start >= mids.length);
        packet.ws.send(JSON.stringify({
            eventType: "messages",
            messages: msgstld,
            room: packet.room,
            isTop: done
        }));
    }
};
