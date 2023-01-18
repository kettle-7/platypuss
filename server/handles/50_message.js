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

const { v4 } = require("uuid");
const rateLimit = 1000; // Minimum time between messages sent, change this if you like.
const allowDuplicates = false;

module.exports = {
	eventType: "message",
	execute: function (sdata, wss, packet) {
		if (!("message" in packet)) {
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "missingData",
				"explanation": "The packet was missing important data required \
by the event handler on the server, please make sure your client is sending \
all the information specified in the Platypuss API."
			}));
			return; // don't shove the broken packet on all the clients,
		}           // technically we can but it's antisocial behaviour
		if (packet.message.content.length > 2000) {
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "tooLong",
				"explanation": "That message is too long. Please keep under 2KB. This is to help prevent spam and abuse of the server."
			}));
			return;
		}
		//if (!(/[\!@#$%\^&\*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z0-9]/.test(packet.message.content)) && !packet) {
		if (packet.message.content.replace(/[ \t]/g, "").length < 1) {
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "invisibleMsg",
				"explanation": "An attempt to stop invisible messages."
			}));
			return;
		}
		if (packet.ws.lastMessage == packet.message.content && !allowDuplicates) {
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "repeatMessage",
				"explanation": "Duplicate messages are not allowed on the server."
			}));
			return;
		}
		if (packet.ws.lastInteractionSent == undefined) {
			packet.ws.lastInteractionSent = Date.now();
			packet.ws.lastMessage = packet.message.content;
		}
		else if (packet.ws.lastInteractionSent + rateLimit > Date.now()) {
			packet.ws.send(JSON.stringify({
				"eventType": "rateLimit",
				"delay": packet.ws.lastInteractionSent + rateLimit - Date.now(),
				"explanation": "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa too many messages",
				"repeatedPacket": {
					eventType: "message",
					message: packet.message
				}
			}));
			return;
		}
		else {
			packet.ws.lastInteractionSent = Date.now();
			packet.ws.lastMessage = packet.message.content;
		}
	    let	mid = v4();
	    let author = packet.ws.uid;
		packet.message.author = author;
		packet.message.id = mid;
		sdata.messages[mid] = packet.message;
		console.log(`<${author}> ${packet.message.content}`);
		for (let client of wss.clients) {
			client.send(JSON.stringify({
				eventType: "message",
				message: {
					content: packet.message.content,
					id: mid,
					author: author
				}
			}));
		}
		return sdata;
	}
};