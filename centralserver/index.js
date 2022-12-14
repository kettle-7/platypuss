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

const { userInfo } = require('os');

const fs = require('fs');
const { createServer } = require("http");
const { v4 } = require("uuid");

var conf = JSON.parse(fs.readFileSync("./conf.json")).server;
var users = JSON.parse(fs.readFileSync("./users.json"));
var sessions = {};

class User {
    constructor(unam, pwd) {
        this.unam = unam;
        this.pfp = conf.icon;
        this.pwd = pwd;
        this.id = v4();
        users[this.id] = this;
    }
}

class Session {
    constructor(uid, server) {
        this.uid = uid;
        this.server = server;
        this.ctime = Date.now();
        this.id = v4();
        sessions[this.id] = this;
    }
}

const server = createServer((req, res) => {
    var url = new URL(req.url, `http://${req.headers.host}`);

    // annoying server stuff

    if (url.pathname == "/li") {
        let data, ift, unam, pwd, ser;
        try {
            data = JSON.parse(req.body.toString());
            ift = data.ift.toString().replace(/ /g, "-");
            unam = data.unam.toString();
            pwd = data.unam.toString();
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
                }
            }
            if (ift == "false" || !ift) {
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
            }
        }
        catch {
            res.writeHead(403, {"Content-Type": "text/plain"});
            res.end("invalid json data or non-post request");
            return;
        }
    }

    if (url.pathname == "/sinfo") {
        if (!url.searchParams.has('id')) {
            res.writeHead(403, {"Content-Type": "text/plain"});
            res.end("missing session id");
            return;
        }
        let sid = url.searchParams.get('id');
        if (!sessions[sid]) {
            res.writeHead(403, {"Content-Type": "text/plain"});
            res.end("not a session id");
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(sessions[sid]));
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
            else res.end(data);
        });
        return;
    }
});

server.listen(conf.port, conf.hostname, () => {
    console.log(`Server running at http://${conf.hostname}:${conf.port}/, press Ctrl+C to stop.`);
});