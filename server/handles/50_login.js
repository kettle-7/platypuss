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

const https = require("https");
const { v4 } = require("uuid");
const { User, availablePerms } = require("./platypussDefaults.js");

module.exports = {
    eventType: "login",
    execute: function (sdata, wss, packet, clients) {
        if (packet.inviteCode != sdata.properties.inviteCode) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "invalidInvite",
                explanation: "You are not invited to the server or the invite you have been sent is expired."
            }));
            return;
        }
        https.get(`${sdata.properties.authAddr}/uinfo?id=${packet.sessionID}`, (res) => {
            let chunks = [];
            res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            res.on('error', (err) => reject(err));
            res.on('end', () => {
                let data;
                try {
                    data = Buffer.concat(chunks).toString('utf8');
                    if (data == "not an user id") {
                        packet.ws.send(JSON.stringify({
                            eventType: "error",
                            code: "notUser",
                            explanation: "Your account wasn't found. Please try logging out and then in again to see if this resolves the issue."
                        }))
                        return sdata;
                    }
                    data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                    packet.ws.loggedinbytoken = true;
                    packet.ws.uid = data.id;
                    packet.ws.sessionID = packet.sessionID;
                    if (!(Object.keys(sdata.users).includes(data.id))) {
                        console.log(`${data.unam} has joined us today.`);
                        sdata.users[data.id] = new User(data.id, data.tag);
                        let mid = v4();
                        sdata.messages[mid] = {
                            special: true,
                            content: `${data.unam} has joined us today.`,
                            stamp: Date.now(),
                            id: mid,
                            author: "server"
                        }
                        for (let client of clients) {
                            if (client != packet.ws && client.loggedinbytoken)
                            client.send(JSON.stringify({
                                eventType: "welcome",
                                user: data.id,
                                globalPermissions: sdata.users[client.uid].globalPerms,
                                isAdmin: sdata.properties.admins.includes(client.uid),
                                explanation: `${data.unam} has joined us today.`
                            }));
                        }
                    } else {
                        if (sdata.users[packet.ws.uid].banned) {
                            packet.ws.send(JSON.stringify({
                                eventType: "banned",
                                explanation: `You have been banned from this server :3`
                            }));
                            return;
                        }
                        console.log(`${data.unam} connected to the server.`);
                        for (let client of clients) {
                            if (client != packet.ws && client.loggedinbytoken)
                            client.send(JSON.stringify({
                                eventType: "join",
                                user: data.id,
                                globalPermissions: sdata.users[client.uid].globalPerms,
                                isAdmin: sdata.properties.admins.includes(client.uid),
                                explanation: `${data.unam} connected to the server.`
                            }));
                        }
                    }
                    let obj = {
                        eventType: "connected",
                        explanation: "You've connected to the server successfully.",
                        manifest: sdata.properties.manifest,
                        permissions: sdata.users[packet.ws.uid].globalPerms,
                        availablePermissions: availablePerms,
                        isAdmin: sdata.properties.admins.includes(data.id)
                    }
                    obj.peers = {};
                    for (let user of Object.values(sdata.users)) {
                        obj.peers[user.id] = {
                            id: user.id,
                            globalPermissions: user.globalPerms,
                            isAdmin: sdata.properties.admins.includes(user.id),
                            online: false
                        }
                    }
                    for (let client of clients) {
                        if (client.readyState < 2 && client.loggedinbytoken && obj.peers[client.uid] != undefined) {
                            obj.peers[client.uid].online = true;
                        }
                    }
                    obj.rooms = {};
                    console.log(sdata.rooms);
                    for (let room of Object.values(sdata.rooms)) {
                        console.log(room, sdata.rooms);
                        // TODO: permissions
                        obj.rooms[room.id] = {
                            id: room.id,
                            name: room.name,
                            messages: {}
                        }
                    }
                    console.log(obj.rooms);
                    packet.ws.send(JSON.stringify(obj));
                    return sdata;
                } catch (e) {
                    console.log(e);
                    packet.ws.send(JSON.stringify({
                        "eventType": "error",
                        "code": "invalidSession",
                        "explanation": "The session ID provided is not valid, \
try logging out then back in again to see if the issue is fixed."
                    }));
                    return;
                }
            });
        });
    }
};
