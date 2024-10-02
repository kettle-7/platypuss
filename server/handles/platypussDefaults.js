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

// This file contains lots of commom useful classes for random stuff.

const { v4 } = require('uuid');

// Feel free to modify these to your liking (you may want different default permissions or maximum file size)
module.exports = {
    maximumFileSize: 25 * 1024 * 1024,
    defaultPermissions: [
        "message.send",
        "message.read",
        "message.history",
        "message.delete",
        "message.edit",
        "message.attach",
        "room.view"
    ],

    availablePerms: {
        "message.send": "send text messages",
        "message.read": "read text messages",
        "message.history": "see messages sent while they were offline",
        "message.delete": "delete their own messages",
        "message.edit": "edit their own messages",
        "message.attach": "attach files and images to their messages",
        "moderation.delete": "delete other people's messages",
        "moderation.ban": "ban others from the server",
        "room.add": "add rooms to the server",
        "room.view": "view rooms in the server",
        "room.edit": "edit rooms on the server",
        "room.delete": "delete rooms from the server",
        "admin.editpermissions": "edit other people's permissions (this does not include their own)"
    },

    User: class {
        constructor(id) {
            this.id = id;
            this.groups = [];
            this.globalPermissions = module.exports.defaultPermissions;
            this.uploadedFiles = [];
        }
    },

    Group: class {
        constructor() {
            this.id = v4();
            this.members = [];
            this.colour = "#eeeeee";
            this.globalPermissions = module.exports.defaultPermissions;
        }
    },

    Room: class {
        constructor(id, name) {
            this.id = id;
            this.name = name;
            this.include = [];
            this.exclude = [];
            this.public = true;
            this.messages = [];
            this.permissionOverrides = {};
        }
    },

    Message: class {
        constructor(author, room, content) {
            this.id = v4();
            this.content = content;
            this.author = author;
            this.room = room;
        }
    },

    Channel: class {
        constructor() {
            this.id = v4();
            this.permissions = {};
        }
    },

    generateInviteCode: function(subserver, port, inviteCode) {
        let code = "";
        for (let part of subserver.split(".")) {
            cp = parseInt(part, 10).toString(16);
            while (cp.length < 2) {
                cp = "0" + cp;
            }
            code += cp;
        }
        // the invite code must be at least 16
        code += parseInt(port, 10).toString(16) + parseInt(inviteCode, 10).toString(16);
        return `https://beta.platypuss.net/chat/?invite=${code}&ip=www.platypuss.net`;
    }
};