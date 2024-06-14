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
	eventType: "messageDelete",
	execute: function (sdata, wss, packet, clients) {
        if (packet.id == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingId",
                explanation: "messageDelete event requires an id of the message to delete"
            }));
            return;
        }
        if (sdata.messages[packet.id] == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "nothingModify",
                explanation: "The client requested a modification to a non-existent object"
            }));
            return;
        }
        if (!(
            (sdata.messages[packet.id].author == packet.ws.uid && sdata.users[packet.ws.uid].globalPerms.includes("message.delete"))
            || sdata.users[packet.ws.uid].globalPerms.includes("moderation.delete"))) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPerm",
                explanation: "you can't do that"
            }));
            return;
        }
        delete sdata.messages[packet.id];
        for (let client of clients) {
            if (client.loggedinbytoken)
            client.send(JSON.stringify({
                eventType: "messageDeleted",
                messageId: packet.id
            }));
        }
        return sdata;
    }
};
