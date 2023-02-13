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

const os = require('os');
const { formidable } = require("formidable")

const fs = require('fs');
const { createServer } = require("http");
const { v4 } = require("uuid");
const path = require('path');

var conf = JSON.parse(fs.readFileSync("./conf.json")).server;
var users = JSON.parse(fs.readFileSync("./users.json"));
var sessions = {};

function ClientUser(u) {
    if (u.tag == undefined) {
        users.count++;
        console.log(users.count);
        users[u.id].tag = toBase26(users.count);
        u.tag = toBase26(users.count);
        fs.writeFile("./users.json", JSON.stringify(users), () => {})
    }
    return {
        unam: u.unam,
        pfp: u.pfp,
        id: u.id,
        aboutMe: u.aboutMe,
        tag: u.tag
    }
}

class User {
    constructor(unam, pwd) {
        this.pfp = conf.icon;
        this.servers = [];
        this.unam = unam;
        this.pwd = pwd;
        this.id = v4();
        this.aboutMe = {
            text: ""
        };
        this.tag = toBase26(users.count);
        users.count++;
        users[this.id] = this;
    }
}

class Session {
    constructor(uid, server) {
        this.ctime = Date.now();
        this.server = server;
        this.uid = uid;
        this.id = v4();
        sessions[this.id] = this;
    }
}

function toBase26(number) {
    let string = '';
	let _number = number;
	while (_number > 0) {
		string = (String.fromCharCode('a'.charCodeAt(0) - 1 + (_number % 26 || 26))) + string;
		_number = Math.floor((_number - 1) / 26);
	}
	return string;
}

const server = createServer((req, res) => {
    var url = new URL(req.url, `http://${req.headers.host}`);

    // annoying server stuff

    if (url.pathname == "/pfpUpload") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        let ctype = "png";
        if (url.searchParams.has('ctype')) {
            ctype = url.searchParams.get("ctype");
            if (ctype.includes("/")) { // naughty file extension shenanigans
                ctype = "png";
            }
        }
        if (!sessions[sid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        // this should probably not be hardcoded ...
        if (sessions[sid].server != "122.62.122.75:3000") {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("You may not use server-specific tokens to modify account \
data, this is to prevent server owners from hijacking accounts.");
            return;
        }
        try {
            const chunks = [];
            let received = 0;
            req.on("data", (chunk) => {
                received += chunk.length;
                if (received > 5000000) req.destroy();
                chunks.push(chunk);
            });
            req.on("end", () => {
                let data = Buffer.concat(chunks);
                fs.writeFile("./avatars/"+sessions[sid].uid+"."+ctype, data, () => {});
                users[sessions[sid].uid].pfp = "/avatars/"+sessions[sid].uid+"."+ctype.toLowerCase();
                fs.writeFile("./users.json", JSON.stringify(users), () => {});
            });
        }
        catch (e) {
            console.log(e);
            res.writeHead(403, {"Content-Type": "text/plain"});
            res.end("some error, idk");
            return;
        }
    }

    if (url.pathname == "/upload") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid] || !users[sessions[sid].uid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        const form = formidable({
            maxFiles: 5,
            maxFileSize: 25 * 1024 * 1024,
            uploadDir: `./usercontent/uploads/${sessions[sid].uid}/`,
            filename: (name, ext, part, form) => {
                fs.mkdirSync(`./usercontent/uploads/${sessions[sid].uid}/`, {recursive: true})
                return `${v4()}.${ext}`;
            }
        });
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, {'Content-Type':'text/plain'});
                res.end(String(err));
                return;
            }
            // do something here
        })
    }

    if (url.pathname == "/li" || (url.pathname == "/login" && req.method.toLowerCase() == "post")) {
        let ift, unam, pwd, ser;
        try {
            const chunks = [];
            req.on("data", (chunk) => {
                chunks.push(chunk);
            });
            req.on("end", () => {
                const data = JSON.parse(Buffer.concat(chunks).toString());
                ift = data.ift.toString();
                unam = data.unam.toString().replace(/ /g, "-");
                pwd = data.pwd.toString();
                ser = data.ser.toString();
                /*if (!unam.match(/^[A-Za-z0-9`~!@#$%^&*(){}\[\]]*$/)) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        exists: true,
                        sid: 0
                    }));
                    return;
                }*/
                if (ift == "false" || !ift) {
                    let has = false;
                    for (let u in users) {
                        if (users[u].unam == unam) {
                            has = true;
                            if (users[u].pwd == pwd) {
                                res.writeHead(200, { "Content-Type": "application/json" });
                                res.end(JSON.stringify({
                                    exists: true,
                                    pwd: true,
                                    sid: new Session(u, ser).id
                                }));
                            }
                            else {
                                res.writeHead(200, { "Content-Type": "application/json" });
                                res.end(JSON.stringify({
                                    exists: true,
                                    pwd: false,
                                    sid: 0
                                }));
                            }
                            return;
                        }
                    }
                    
                    if (!has) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            exists: false,
                            pwd: true,
                            sid: 0
                        }));
                        return;
                    }
                }
                else {
                    for (let u in users) {
                        if (users[u].unam == unam) {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({
                                exists: true,
                                sid: 0
                            }));
                            return;
                        }
                    }
                    if (unam.length > 30 || pwd.length > 30) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            exists: true,
                            sid: 0
                        }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        exists: false,
                        sid: new Session(new User(unam, pwd).id, ser).id
                    }));
                    fs.writeFile("./users.json", JSON.stringify(users), () => {});
                    return;
                }
            });
        }
        catch (e) {
            console.log(e);
            res.writeHead(403, {"Content-Type": "text/plain"});
            res.end("invalid json data or non-post request");
            return;
        }
    }

    else if (url.pathname == "/joinserver") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        if (!url.searchParams.has('ip')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing ip for server to join");
            return;
        }
        // this should probably not be hardcoded ...
        if (sessions[sid].server != "122.62.122.75:3000") {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("You may not use server-specific tokens to modify account \
data, this is to prevent server owners from hijacking accounts.");
            return;
        }
        if (!users[sessions[sid].uid].servers.includes(url.searchParams.get("ip")))
            users[sessions[sid].uid].servers.push(url.searchParams.get('ip'));
        fs.writeFile("./users.json", JSON.stringify(users), () => {});
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("success");
    }

    else if (url.pathname == "/leaveserver") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        if (!url.searchParams.has('ip')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing ip for server to leave");
            return;
        }
        // this should probably not be hardcoded ...
        if (sessions[sid].server != "122.62.122.75:3000") {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("You may not use server-specific tokens to modify account \
data, this is to prevent server owners from hijacking accounts.");
            return;
        }
        if (users[sessions[sid].uid].servers.includes(url.searchParams.get("ip")))
            users[sessions[sid].uid].servers.splice(users[sessions[sid].uid].servers.indexOf(url.searchParams.get('ip')));
        fs.writeFile("./users.json", JSON.stringify(users), () => {});
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("success");
    }

    else if (url.pathname == "/delacc") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        // this should probably not be hardcoded ...
        if (sessions[sid].server != "122.62.122.75:3000") {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("You may not use server-specific tokens to modify account \
data, this is to prevent server owners from hijacking accounts.");
            return;
        }
        delete users[sessions[sid].uid];
        fs.writeFile("./users.json", JSON.stringify(users), () => {});
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("success");
        return;
    }

    else if (url.pathname == "/passwdcfg") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        if (!url.searchParams.has("pwd")) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("no new password is provided");
            return;
        }
        // this should probably not be hardcoded ...
        if (sessions[sid].server != "122.62.122.75:3000") {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("You may not use server-specific tokens to modify account \
data, this is to prevent server owners from hijacking accounts.");
            return;
        }
        users[sessions[sid].uid].pwd = url.searchParams.get("pwd");
        fs.writeFile("./users.json", JSON.stringify(users), () => {});
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("success");
    }

    else if (url.pathname == "/sload") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid] || !users[sessions[sid].uid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        // this should probably not be hardcoded ...
        if (sessions[sid].server != "122.62.122.75:3000") {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("You may not use server-specific tokens to modify account \
data, this is to prevent server owners from hijacking accounts.");
            return;
        }
        let tokens = {};
        for (let ser of users[sessions[sid].uid].servers) {
            tokens[ser] = (new Session(sessions[sid].uid, ser).id);
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({
            servers: tokens,
            userId: sessions[sid].uid
        }));
        return;
    }

    else if (url.pathname == "/sinfo") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid] || !users[sessions[sid].uid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(sessions[sid]));
    }

    else if (url.pathname == "/uinfo") {
        if (!url.searchParams.has('id')) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("missing user id");
            return;
        }
        let uid = url.searchParams.get('id');
        if (!users[uid]) {
            let sid = url.searchParams.get('id');
            if (!sessions[sid] || !users[sessions[sid].uid]) {
                res.writeHead(204, {"Content-Type": "text/plain"});
                res.end("not an user id");
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(ClientUser(users[sessions[sid].uid])));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        if (users[uid].aboutMe == undefined) {
            users[uid].aboutMe = {text:""};
            fs.writeFileSync("./users.json", JSON.stringify(users), () => {});
        }
        if (!users[uid].tag) {
            users[uid].tag = toBase26(users.count);
            users.count++;
            fs.writeFile("./users.json", JSON.stringify(users), () => {});
        }
        res.end(JSON.stringify(ClientUser(users[uid])));
    }

    // regular pages

    else if (url.pathname.startsWith("/avatars")) {
        let ctype = "image/png";
        switch (path.extname(url.pathname)) {
            case "gif":
                ctype = "image/gif";
                break;
            case "bmp":
                ctype = "image/bmp";
                break;
            case "jpg":
            case "jpeg":
                ctype = "image/jpeg";
                break;
            case "tiff":
            case "tif":
                ctype = "image/tiff";
                break;
            default:
                ctype = "image/png";
                break;
        }
        if (!fs.existsSync("./avatars/"+path.basename(url.pathname))) {
            res.writeHead(302, {"Location": conf.icon});
            res.end(conf.icon);
            return;
        }
        let stream = fs.createReadStream("./avatars/"+path.basename(url.pathname))
        res.writeHead(200, {"Content-Type": ctype});
        stream.on("ready", () => {
            stream.pipe(res);
        });
        return;
    }

    else if (url.pathname.startsWith("/uploads")) {
        url.pathname = url.pathname.replace(/\.\./g, "");
        if (!fs.existsSync("./usercontent"+url.pathname)) {
            res.writeHead(404, "thats not a page owo", { "Content-Type": "text/html" });
            fs.readFile("./found.html", (err, data) => {
                if (err) {
                    res.end("404: 404 not found (ultimate bad error) (maybe just wait until we can fix it lol)");
                    console.log(err.toString());
                }
                else res.end(data.toString()+" "+req.url+" -->");
            });
            return;
        }
        let stream = fs.createReadStream("./usercontent"+url.pathname)
        res.writeHead(200, {"Content-Type": ctype});
        stream.on("ready", () => {
            stream.pipe(res);
        });
        return;
    }

    else if (url.pathname == "/main.css") {
        res.writeHead(200, {"Content-Type": "text/css"});
        fs.readFile("./main.css", (err, data) => {
            if (err) {
                res.end();
                console.log(err.toString());
            }
            else res.end(data);
        });
        return;
    }
    else if (url.pathname == "/index.js") {
        res.writeHead(200, {"Content-Type": "application/javascript"});
        fs.readFile("./index.html.js", (err, data) => {
            if (err) {
                res.end();
                console.log(err.toString());
            }
            else res.end(data.toString().replace(/ICON/, conf.icon));
        });
        return;
    }
    else if (url.pathname == "/index.html" || url.pathname == "/") {
        res.writeHead(200, {"Content-Type": "text/html"});
        fs.readFile("./index.html", (err, data) => {
            if (err) {
                res.end();
                console.log(err.toString());
            }
            else res.end(data.toString().replace(/ICON/g, conf.icon));
        });
        return;
    }
    else if (url.pathname == "/login.js") {
        res.writeHead(200, {"Content-Type": "application/javascript"});
        fs.readFile("./login.html.js", (err, data) => {
            if (err) {
                res.end();
                console.log(err.toString());
            }
            else res.end(data.toString().replace(/ICON/, conf.icon));
        });
        return;
    }
    else if (url.pathname == "/login") {
        res.writeHead(200, {"Content-Type": "text/html"});
        fs.readFile("./login.html", (err, data) => {
            if (err) {
                res.end();
                console.log(err.toString());
            }
            else res.end(data.toString().replace(/ICON/, conf.icon));
        });
        return;
    }
    else if (url.pathname == "/tos") {
        res.writeHead(200, {"Content-Type": "text/html"});
        fs.readFile("./tos.html", (err, data) => {
            if (err) {
                res.end();
                console.log(err.toString());
            }
            else res.end(data.toString().replace(/ICON/, conf.icon));
        });
        return;
    }
    else {
        res.writeHead(404, "thats not a page owo", { "Content-Type": "text/html" });
        fs.readFile("./found.html", (err, data) => {
            if (err) {
                res.end("404: 404 not found (ultimate bad error) (maybe just wait until we can fix it lol)");
                console.log(err.toString());
            }
            else res.end(data.toString()+" "+req.url+" -->");
        });
        return;
    }
});

server.listen(conf.port, conf.hostname, () => {
    console.log(`Server running at http://${conf.hostname}:${conf.port}/, press Ctrl+C to stop.`);
});
