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

// This file contains lots of commom useful classes for random stuff.

import { v4 } from 'uuid';

// Feel free to modify these to your liking (you may want different default permissions)
export const defaultPerms = [
    "message.send",
    "message.read",
    "message.old"
];

export class User {
    constructor(id) {
        this.id = id;
        this.groups = [];
        this.globalPerms = defaultPerms;
    }
}

export class Group {
    constructor() {
        this.id = v4();
        this.members = [];
        this.colour = "#eeeeee";
        this.globalPerms = defaultPerms;
    }
}

export class Message {
    constructor(author, channel, text) {
        this.id = v4();
        this.text = text;
        this.author = author;
        this.channel = channel;
    }
}

export class Channel {
    constructor() {
        this.id = v4();
        this.permissions = {};
    }
}