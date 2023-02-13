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
	execute: function (sdata, wss, packet) {
        if (packet.code != sdata.properties.inviteCode) {
            packet.ws.send(JSON.stringify({
                eventType: "error",
                code: "invalidInvite",
                explanation: "You are not invited to the server or the invite you have been sent is expired."
            }));
        }
        http.get(`http://${sdata.properties.authAddr}/uinfo?id=${packet.sid}`, (res) => {
            let chunks = [];
            res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            res.on('error', (err) => reject(err));
            res.on('end', () => {
                let data;
                try {
                    data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                    packet.ws.loggedinbytoken = true;
                    packet.ws.uid = data.id;
                    if (!(data.id in sdata.users)) {
                        console.log(`${data.unam} has joined us today`);
                        sdata.users[data.id] = new User(data.id);
                        for (let client of wss.clients) {
                            if (client != packet.ws && client.loggedinbytoken)
                            client.send(JSON.stringify({
                                eventType: "welcome",
                                user: data.id,
                                explanation: `${data.unam} has joined us today.`
                            }));
                        }
                    } else {
                        console.log(`${data.unam} connected to the server.`);
                        for (let client of wss.clients) {
                            if (client != packet.ws && client.loggedinbytoken)
                            client.send(JSON.stringify({
                                eventType: "join",
                                user: data.id,
                                explanation: `${data.unam} connected to the server.`
                            }));
                        }
                    }
                    let msgstld = [];
                    let mids = Object.keys(sdata.messages);
                    for (let i = mids.length - 20; i < mids.length; i++) { // this acts weirdly when no messages have been sent
                        while (i < 0) i++;
                        msgstld.push(sdata.messages[mids[i]]);
                    }
                    packet.ws.send(JSON.stringify({
                        eventType: "connected",
                        explanation: "You've connected to the server successfully."
                    }));
                    packet.ws.send(JSON.stringify({
                        eventType: "messages",
                        messages: msgstld,
                        isTop: (mids.length <= 20)
                    }));
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
