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

const http = require("http");
const { User } = require("./platypussDefaults.js");

module.exports = {
	eventType: "login",
	execute: async function (server, wss, packet) {
        if (packet.code != server.properties.inviteCode) {
            packet.ws.send(JSON.stringify({
                "type": "error",
                "code": "invalidInvite",
                "explanation": "You are not invited to the server or the invite you have been sent is expired."
            }));
        }
        http.get(`http://${server.properties.authAddr}/uinfo?id=${packet.sid}`, (res) => {
            let chunks = [];
            res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            res.on('error', (err) => reject(err));
            res.on('end', () => {
                let data;
                try {
                    data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                } catch {
                    packet.ws.send(JSON.stringify({
                        "type": "error",
                        "code": "invalidSession",
                        "explanation": "The session ID provided is not valid,\
try logging out then back in again to see if the issue is fixed."
                    }));
                }
                if (!(data.id in server.users)) {
                    console.log(`${data.unam} has joined us today`);
                    server.users[id] = new User(id);
                    packet.ws.uid = id;
                }
            });
        });
	}
};