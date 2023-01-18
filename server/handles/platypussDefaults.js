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

const { v4 } = require('uuid');

// Feel free to modify these to your liking (you may want different default permissions)
module.exports = {
    defaultPerms: [
        "message.send",
        "message.read",
        "message.old"
    ],

    User: class {
        constructor(id) {
            this.id = id;
            this.groups = [];
            this.globalPerms = module.exports.defaultPerms;
        }
    },

    Group: class {
        constructor() {
            this.id = v4();
            this.members = [];
            this.colour = "#eeeeee";
            this.globalPerms = module.exports.defaultPerms;
        }
    },

    Message: class {
        constructor(author, channel, content) {
            this.id = v4();
            this.content = content;
            this.author = author;
            this.channel = channel;
        }
    },

    Channel: class {
        constructor() {
            this.id = v4();
            this.permissions = {};
        }
    }
};