 /************************************************************************
 * Copyright 2020-2024 Ben Keppel, Moss Finder                           *
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
	eventType: "ban",
	execute: function (sdata, wss, packet, clients) {
        if (packet.userID == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingField",
                explanation: "Ban event requires the ID of the user to be banned"
            }));
            return;
        }
        if (sdata.users[packet.userID] == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "nonexistentUser",
                explanation: "The client requested a modification to a non-existent user"
            }));
            return;
        }
        if (!sdata.properties.admins.includes(packet.ws.uid)) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPermission",
                explanation: "You can't do that"
            }));
            return;
        }
        if (!packet.unban) packet.unban = false;
		sdata.users[packet.userID].banned = !packet.unban;
        for (let client of clients) {
            if (client.uid == packet.ws.uid) {
                client.close();
            }
        }
		return sdata;
    }
};
