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
const { } = require("./platypussDefaults.js"); // import nothing :o)
const fs = require("fs");
const exec = require('child_process').exec;

const rateLimit = 500; // Minimum time between messages sent, change this if you like.
const maxLength = 2000; // Maximum length of messages that can be sent, change this one if you want as well UwU.
const allowDuplicates = true; // Whether or not someone can send the same message more than once in a row, change this if you like too Nyaaa~!

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
		if (packet.message.content.length > maxLength) {
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "tooLong",
				"explanation": "That message is too long. Please keep under " + (maxLength / 1000).toString() + "KB. This is to help prevent spam and abuse of the server."
			}));
			return;
		}
		//if (!(/[\!@#$%\^&\*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z0-9]/.test(packet.message.content)) && !packet) {
		if (packet.message.content.replace(/[ \t\r\n]/g, "").length < 1) {
			let skill = true;
			console.log(packet.message.uploads);
			if (packet.message.uploads.length) {
				skill = false;
			}
			if (skill)
				packet.ws.send(JSON.stringify({
					"eventType": "error",
					"code": "invisibleMsg",
					"explanation": "An attempt to stop invisible messages.<br><br><pre><code>"+JSON.stringify(packet.message)+"</code></pre>"
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
		if (packet.message.content.replace(/ /g, "").includes(">>>>>")) { // browser crash
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "no",
				"explanation": "no"
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
		if (!sdata.users[packet.ws.uid].globalPerms.includes("message.send")) {
			packet.ws.send(JSON.stringify({
				"eventType": "error",
				"code": "noPerm",
				"explanation": "You can do not that."
			}));
			return;
		}
	    let	mid = v4();
	    let author = packet.ws.uid;
		packet.message.author = author;
		packet.message.id = mid;
		packet.message.stamp = Date.now();
		// change this to your user id
		if (packet.message.author == "c9ee391d-a5e8-4e6b-96fa-4ad042dcd4b3" &&
				packet.message.content == "restart") {
			fs.writeFileSync("./server.json", JSON.stringify(sdata));
			process.exit(0);
			return;
		}
		if (packet.message.author == "c9ee391d-a5e8-4e6b-96fa-4ad042dcd4b3" &&
				packet.message.content == "ghpull") {
			exec('git pull',
			function (error, stdout, stderr) {
				console.log('git: ' + stdout);
				if (stderr)
				console.log('angry git: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});
		}
		sdata.messages[mid] = {
			content: packet.message.content,
			stamp: packet.message.stamp,
			id: mid,
			author: author,
			uploads: packet.message.uploads,
			reply: packet.message.reply
		};
		console.log(`<${author}> ${packet.message.content}`);
		for (let client of wss.clients) {
			if (client.loggedinbytoken && sdata.users[client.uid].globalPerms.includes("message.read"))
			client.send(JSON.stringify({
				eventType: "message",
				message: {
					content: packet.message.content,
					stamp: packet.message.stamp,
					id: mid,
					author: author,
					uploads: packet.message.uploads,
					reply: packet.message.reply
				}
			}));
		}
		return sdata;
	}
};
