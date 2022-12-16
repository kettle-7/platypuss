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

const fs = require('fs');
const { createServer } = require("http");
const { v4 } = require("uuid");

var conf = JSON.parse(fs.readFileSync("./conf.json")).server;
var users = JSON.parse(fs.readFileSync("./users.json"));
var sessions = {};

function ClientUser(u) {
    return {
        unam: u.unam,
        pfp: u.pfp,
        id: u.id
    }
}

class User {
    constructor(unam, pwd) {
        this.pfp = conf.icon;
        this.servers = [];
        this.unam = unam;
        this.pwd = pwd;
        this.id = v4();
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

const server = createServer((req, res) => {
    var url = new URL(req.url, `http://${req.headers.host}`);

    // annoying server stuff

    if (req.url.toString() == "/li" || (url.pathname == "/login" && req.method.toLowerCase() == "post")) {
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
        users[sessions[sid].uid].servers.push(url.searchParams.get('ip'));
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
        if (!sessions[sid]) {
            res.writeHead(204, {"Content-Type": "text/plain"});
            res.end("invalid session");
            return;
        }
        let tokens = {};
        for (let ser of users[sessions[sid].uid].servers) {
            tokens[ser] = (new Session(sessions[sid].uid, ser).id);
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(tokens));
        return;
    }

    else if (url.pathname == "/sinfo") {
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
            if (!sessions[sid]) {
                res.writeHead(204, {"Content-Type": "text/plain"});
                res.end("not an user id");
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(ClientUser(users[sessions[sid].uid])));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(ClientUser(users[uid])));
    }

    // regular pages

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
            else res.end(data.toString().replace(/ICON/, conf.icon));
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