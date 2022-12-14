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

fs = require('fs');
createServer = require("http").createServer;
uuidv4 = require("uuid").v4;

conf = JSON.parse(fs.readFileSync("./conf.json")).server;

class User {
    constructor(unam, pwd) {
        this.unam = unam;
        this.pwd = pwd;
        this.id = uuidv4();
    }
}

const server = createServer((req, res) => {
    var url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname == "/main.css") {
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
    else {
        res.writeHead(404, "thats not a page owo", { "Content-Type": "text/html" });
        fs.readFile("./found.html", (err, data) => {
            if (err) {
                res.end("404: 404 not found (ultimate bad error) (maybe just wait until we can fix it lol)");
                console.log(err.toString());
            }
            else res.end(data);
            new User();
        });
        return;
    }
});

server.listen(conf.port, conf.hostname, () => {
    console.log(`Server running at http://${conf.hostname}:${conf.port}/, press Ctrl+C to stop.`);
});