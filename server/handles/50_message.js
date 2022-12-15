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

export const eventType = "message";
export async function execute(server, wss, packet) {
	for (let client of wss.clients) {
		// just give all other clients the message to deal with (does not support private channels)
		if (!("message" in packet)) {
			packet.ws.send(JSON.stringify({
				"type": "error",
				"code": "missingData",
				"explanation": "The packet was missing important data required\
 by the event handler on the server, please make sure your client is sending \
all the information specified in the Platypuss API."
			}));
			return; // don't shove the broken packet on all the clients, while
		}           // technically we can it's antisocial behaviour
		client.send(JSON.stringify(packet));
	}
}