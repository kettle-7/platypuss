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

 const { availablePerms } = require("./platypussDefaults.js");

 module.exports = {
	eventType: "permissionChange",
	execute: function (sdata, wss, packet, clients) {
        if (packet.userID == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingField",
                explanation: "The permissionChange event needs the ID of the user of whose permissions to change."
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
        if (!(sdata.properties.admins.includes(packet.ws.uid) || (sdata.users[packet.ws.uid].globalPermissions.includes("admin.permedit") && packet.ws.uid !== packet.userID))) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "noPermission",
                explanation: "You can't do that"
            }));
            return;
        }
        if (packet.permission == undefined) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingField",
                explanation: "The permissionChange event needs the name of the permission to change."
            }));
            return;
        }
        if (!Object.keys(availablePerms).includes(packet.permission)) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "nonexistentPermission",
                explanation: "That permission doesn't exist. Check the availablePermissions property sent when you logged in for which permissions this server has."
            }));
            return;
        }
        // i don't really like how typeof returns a string (but then i also have no idea what i want it to do lmao)
        if (typeof packet.value !== typeof true) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "missingField",
                explanation: "The permissionChange event needs the name of the permission to change."
            }));
            return;
        }
        if (packet.value) {
            if (sdata.users[packet.userID].globalPermissions.includes(packet.permission)) {
                return; // don't need to do anything
            } else {
                sdata.users[packet.userID].globalPermissions.push(packet.permission);
                for (let client of clients) {
                    if (client.uid !== packet.userID) continue;
                    if (client.uid == packet.ws.uid) {
                        client.send(JSON.stringify({
                            eventType: "permissionChange",
                            permission: packet.permission,
                            value: !!packet.value, // just to be sure it's boolean
                            user: packet.userID,
                            explanation: `You can now ${availablePerms[packet.permission]}.`
                        }));
                    } else if (sdata.properties.admins.includes(client.uid)) {
                        client.send(JSON.stringify({
                            eventType: "permissionChange",
                            permission: packet.permission,
                            value: !!packet.value,
                            user: packet.userID,
                            explanation: `Someone else can now ${availablePerms[packet.permission]}.`
                        }));
                    }
                }
            }
        } else {
            if (sdata.users[packet.userID].globalPermissions.includes(packet.permission)) {
                while (sdata.users[packet.userID].globalPermissions.includes(packet.permission)) {
                    sdata.users[packet.userID].globalPermissions.splice(sdata.users[packet.userID].globalPermissions.indexOf(packet.permission), 1);
                }
                for (let client of clients) {
                    if (client.uid !== packet.userID) continue;
                    if (client.uid == packet.ws.uid) {
                        client.send(JSON.stringify({
                            eventType: "permissionChange",
                            permission: packet.permission,
                            value: !!packet.value,
                            user: packet.userID,
                            explanation: `You can now no longer ${availablePerms[packet.permission]}.`
                        }));
                    } else if (sdata.properties.admins.includes(client.uid)) {
                        client.send(JSON.stringify({
                            eventType: "permissionChange",
                            permission: packet.permission,
                            value: !!packet.value,
                            user: packet.userID,
                            explanation: `Someone else can now no longer ${availablePerms[packet.permission]}.`
                        }));
                    }
                }
            } else {
                console.log("skill issue");
                return;
            }
        }
		return sdata;
    }
};
