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
	eventType: "messageLoad",
	execute: function (sdata, wss, packet) {
        let numberToLoad = 20;
        let start = 0;
        if (packet.numberToLoad != undefined)
            numberToLoad = packet.numberToLoad;
        if (packet.start != undefined)
            start = packet.start;
        let msgstld = [];
        let mids = Object.keys(sdata.messages);
        for (let i = mids.length - numberToLoad - packet.start; i < mids.length; i++) { // this acts weirdly when no messages have been sent
            while (i < 0) i++;
            msgstld.push(sdata.messages[mids[i]]);
        }
        packet.ws.send(JSON.stringify({
            eventType: "messages",
            messages: msgstld
        }));
    }
};
