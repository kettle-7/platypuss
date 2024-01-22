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
	eventType: "updatePermissions",
	execute: function (sdata, wss, packet) {
        if (packet.uid == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingField",
                explanation: "updatePermissions event requires the ID of the user to update the permissions of."
            }));
            return;
        }
        if (sdata.users[packet.uid] == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "nonexistentUser",
                explanation: "The client requested a modification to a non-existent user."
            }));
            return;
        }
        if (!sdata.properties.admins.includes(packet.ws.uid)) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPerm",
                explanation: "You need administrative permissions to update other people's permissions on this server."
            }));
            return;
        }
        if (packet.perms == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingField",
                explanation: "updatePermissions event requires the new list of permissions to replace the user's current ones with."
            }));
            return;
        }
        if (packet.perms.constructor !== Array) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "incorrectDataType",
                explanation: "packet.perms must be a list / array."
            }));
            return;
        }
        sdata.users[packet.uid].globalPerms = packet.perms;
		return sdata;
    }
};
