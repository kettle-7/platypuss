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
	eventType: "ban",
	execute: function (sdata, wss, packet) {
        if (packet.uid == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingId",
                explanation: "Ban event requires the uid of the user"
            }));
            return;
        }
        if (sdata.users[packet.uid] == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "nonexistantUser",
                explanation: "The client requested a modification to a non-existent user"
            }));
            return;
        }
        if (!sdata.properties.admins.contains(packet.ws.uid)) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPerm",
                explanation: "You can't do that"
            }));
            return;
        }
		if (!("uid" in packet)) {
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "missingData",
				"explanation": "The packet was missing important data required \
by the event handler on the server, please make sure your client is sending \
all the information specified in the Platypuss API."
			}));
			return; // don't shove the broken packet on all the clients,
		}           // technically we can but it's antisocial behaviour uwu
		sdata.users[packet.uid].banned = true;
        for (let client of wss.clients) {
            if (client.uid == packet.ws.uid) {
                client.close();
            }
        }
		return sdata;
    }
};
