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

// °^° i am pingu
const ereg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi

/** yes i just used const to define a function what are you going to do about it */
const cyrb53 = (str, seed = 20) => { // random hashing algorithm off stack overflow
    let h1 = 0xdeadbeef ^ seed, // dead beef
    h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return (h2>>>0).toString(16).padStart(8,0)+(h1>>>0).toString(16).padStart(8,0);
};

var converty = new showdown.Converter({
    noHeaderId: true,
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    simpleLineBreaks: true,
    requireSpaceBeforeHeadingText: true,
    openLinksInNewWindow: true,
    emoji: true,
    underline: true
});

var oldestMessage = 0;
var url = new URL(window.location);
var loggedin = true;
var usercache = {};
var uploadQueue = {};
var authUrl = localStorage.getItem("authUrl");
var messageMap = {};
var ift = false;
var premyum = false;
var abm, oldunam;
var mRef = {};
if (!authUrl) authUrl = "https://platypuss.net";

function li() {
    ift = false;
    document.getElementById('P').style.display = 'flex';
    document.getElementById("pwd2").hidden = true;
    document.getElementById("pr1").hidden = true;
    document.getElementById("pr2").hidden = true;
    document.getElementById("unam").hidden = true;
    document.getElementById("pwd1").addEventListener("keypress", (e) => {
        if (e.key == "Enter")
            doTheLoginThingy();
    });
    document.getElementById("lit1").innerHTML = document.getElementById("lit1").innerHTML.replace(/Create Account/g, "Sign In");
    document.getElementById("lit2").innerHTML = 'Welcome back! If you don\'t already have an account <br> please <a href="#" onclick="su()">create an account</a> instead.';
    document.getElementById("lit3").innerText = document.getElementById("lit3").innerText.replace(/Create Account/g, "Sign In");
    return;
}

function su() {
    ift = true;
    document.getElementById('P').style.display = 'flex';
    document.getElementById("pwd2").hidden = false;
    document.getElementById("pr1").hidden = false;
    document.getElementById("pr2").hidden = false;
    document.getElementById("unam").hidden = false;
    document.getElementById("pwd2").addEventListener("keypress", (e) => {
        if (e.key == "Enter")
            doTheLoginThingy();
    });
    document.getElementById("lit1").innerHTML = document.getElementById("lit1").innerHTML.replace(/Sign In/g, "Create Account");
    document.getElementById("lit2").innerHTML = '<span id="lit2">Welcome to Platypuss! If this is not your first time with us <br> please <a href="#" onclick="li()"> \
sign in</a> instead. Please make sure to read the <br> <a href="/tos">terms of service</a> before creating an account.</span>';
    document.getElementById("lit3").innerText = document.getElementById("lit3").innerText.replace(/Sign In/g, "Create Account");
}

function doTheLoginThingy() {
    let unam = document.getElementById("unam").value;
    let email = document.getElementById("email").value;
    let pwd1 = document.getElementById("pwd1").value;
    if (ift) { // if you're making a new account rather than logging into an existing one
        let pwd2 = document.getElementById("pwd2").value;
        if (pwd1 != pwd2) {
            document.getElementById("lit2").innerText = "Your passwords don't match.";
            return;
        }
        if (unam == "") {
            document.getElementById("lit2").innerText = "Please fill this out, you can't just make an account without an username...";
            return;
        }
        if (pwd1 == "") {
            document.getElementById("lit2").innerText = "Please fill this out, you can't just make an account without a password...";
            return;
        }
        let jsonobjectforloggingin = JSON.stringify({ // i want long variable name
            "ift": ift,
            "ser": "example.com", // reserved domain and therefore won't be used by anyone
            "unam": unam,
            "email": email,
            "pwd": cyrb53(pwd1)
        });
        const xhr = new XMLHttpRequest();
        xhr.open("POST", authUrl + '/li', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
                let res = JSON.parse(xhr.responseText);
                if (res.exists) {
                    document.getElementById("lit2").innerHTML = 'You\'ve already made an account with that email address, would you like to <a onclick="li()">log in</a> instead?';
                    return;
                }
                document.getElementById("lit2").innerHTML = 'An email has now been sent to that address, please check your inbox for a link to verify your account.';
            }
        };
        xhr.send(jsonobjectforloggingin);
        return;
    }
    let jsonobjectforloggingin = JSON.stringify({ // i want long variable name
        "ift": ift,
        "ser": "example.com",
        "email": email,
        "pwd": cyrb53(pwd1)
    });
    const req = new XMLHttpRequest();
    req.open("POST", authUrl + '/li', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.onreadystatechange = () => { // Call a function when the state changes.
        if (req.readyState === XMLHttpRequest.DONE && (req.status == 200 || req.status == 204)) {
            let res = JSON.parse(req.responseText);
            if (!res.exists) {
                document.getElementById("lit2").innerHTML = "There's no account with that email address, would you like to <a onclick=\"su()\">make a new account</a> instead?";
                return;
            }
            if (!res.pwd) {
                document.getElementById("lit2").innerHTML = "That password isn't correct, did you misspell it?";
                return;
            }
            localStorage.setItem('sid', res.sid);
            window.location = "/";
        }
    };
    req.send(jsonobjectforloggingin);
}

function fetchUser(id) {
    return new Promise((resolve, reject) => {
        if (usercache[id] == undefined) {
            const x = new XMLHttpRequest();
            x.open('GET', authUrl+'/uinfo?id='+id, true);
            x.onload = () => {
                if (x.status != 200) {
                    resolve(null);
                    return;
                }
                usercache[id] = JSON.parse(x.responseText);
                resolve(usercache[id]);
            };
            x.send();
        } else {
            resolve(usercache[id]);
        }
    });
}

fetchUser(localStorage.getItem('sid')).then((res) => {
    if (window.location.toString().includes("chausdhsa89h98q3hai")) {
        document.getElementById("ptitle").innerHTML = "chausdhsa89h98q3hai";
        document.getElementById("htitle").innerHTML = "chausdhsa89h98q3hai";
    }
    if (res == null) {
        loggedin = false;
        document.head.removeChild(document.getElementById("ss0"));
        document.getElementById("header").removeChild(document.getElementById("chatbtn"));
        if (localStorage.getItem("theme") == "light")
            document.getElementById("ss1").href = "/light.css";
    }
    else {
        oldunam = res.unam;
        abm = res.aboutMe.text;
        if (res.aboutMe.premyum) {
            premyum = true;
            document.head.removeChild(document.getElementById("ss1"));
            document.head.removeChild(document.getElementById("ss2"));
            if (localStorage.getItem("theme") == "light")
                document.getElementById("ss0").href = "/lightn.css";
        } else {
            document.head.removeChild(document.getElementById("ss0"));
            if (localStorage.getItem("theme") == "light")
                document.getElementById("ss1").href = "/light.css";
        }
        document.getElementById("pfp").src = authUrl + res.pfp;
        document.getElementById("username").innerText = "Logged in as " + res.unam;
        document.getElementById("changePfp").src = authUrl + res.pfp;
        document.getElementById("acsusername").innerText = res.unam;
        document.getElementById("tag").innerText = "@" + res.tag;
        if (abm)
            document.getElementById("acsabm").value = abm;
        document.ppures = res;
    }
    if (loggedin) {
        const filedirectoryaddingrequest = new XMLHttpRequest();
        filedirectoryaddingrequest.open("GET", authUrl+"/dir?id="+localStorage.getItem("sid"));
        document.getElementById("header").removeChild(document.getElementById("login"));
        document.getElementById("header").removeChild(document.getElementById("signup"));
        // document.getElementById("header").removeChild(document.getElementById("spacement"));
        function pickNewAvatar() {
            var input = document.createElement('input');
            input.type = 'file';
            input.onchange = e => { 
                var file = e.target.files[0];
                let ctype = "image/png";
                let l = file.name.toLowerCase().split(".");
                switch (l[l.length - 1]) {
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
                const xhr = new XMLHttpRequest();
                xhr.open("POST", authUrl+'/pfpUpload?id='+localStorage.getItem("sid")+"&ctype="+encodeURIComponent(ctype), true);
                xhr.setRequestHeader("Content-Type", ctype);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
                        window.location.reload();
                    }
                    else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 0) {
                        document.getElementById("avatarTooBig").hidden = false;
                    }
                }
                xhr.send(file);
            };
            input.click();
        }
        document.getElementById("changePfp").addEventListener("click", pickNewAvatar);
        document.getElementById("dodel").addEventListener("click", () => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", authUrl+'/delacc?id='+localStorage.getItem("sid"), true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
                    window.location.reload();
                }
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 204) {
                    console.error(xhr.responseText);
                }
            };
            xhr.send();
        });
        document.getElementById("cpwdsave").addEventListener("click", () => {
            // let pwd1 = document.getElementById("oldPwd").value;
            let pwd2 = document.getElementById("newPwd").value;
            let pwd3 = document.getElementById("newPwd2").value;

            if (pwd2 != pwd3) {
                document.getElementById("nonmatch").hidden = false;
                return;
            }

            if (pwd2.length < 1) {
                document.getElementById("nonmatch").hidden = false;
                document.getElementById("nonmatch").innerText = "You need to have a password!";
                return;
            }
            
            const xhr = new XMLHttpRequest();
            xhr.open("GET", authUrl+'/passwdcfg?id='+localStorage.getItem("sid")+"&pwd="+cyrb53(pwd3), true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
                    window.location.reload();
                }
                else {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        document.getElementById("nonmatch").hidden = false;
                        document.getElementById("nonmatch").innerText = xhr.responseText;
                    }
                }
            };
            xhr.send();
        });
        document.getElementById("loadingScreen").className += " fadeOut";
    }
    else {
        document.getElementById("header").removeChild(document.getElementById("pfp"));
        document.getElementById("loadingScreen").className += " fadeOut";
    }
}, () => {
    if (url.host.startsWith("http://192.168") && !localStorage.getItem("forceAuth")) {
        localStorage.setItem("authUrl", "http://192.168.1.66:3000");
        window.location.reload();
    }
    document.getElementById("header").removeChild(document.getElementById("pfp"));
    document.getElementById("loadingScreen").className += " fadeOut";
});

document.getElementById("accountInfo").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});
document.getElementById("acspopup").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});
document.getElementById("cpwdpopup").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});
document.getElementById("dacpopup").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});
document.getElementById("p").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});
document.getElementById("uifpopup").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        au();
        for (let e of [
            "accountInfoParent",
            "P",
            "acsparent",
            "uifparent",
            "dacparent",
            "cpwdparent"
        ]) {
            document.getElementById(e).style.display = "none";
        }
    }
});

// IMPORTANT: remove this if you're ripping off my client please lol
if (authUrl != url.protocol + "//" + url.host && (url.protocol == "http:" || url.protocol == "https:") && !localStorage.getItem("forceAuth")) {
    localStorage.setItem("authUrl", url.protocol + "//" + url.host);
    window.location.reload();
}

function logout() {
    localStorage.removeItem("sid");
    window.location.reload();
}

var sockets = {};
var loadedMessages = 0;
var focusedServer;
var reply;

function userInfo(id) {
    fetchUser(id).then(res => {
        document.getElementById("uifpfp").src = authUrl + res.pfp;
        document.getElementById("uifusername").innerText = res.unam;
        document.getElementById("uiftag").innerText = "@" + res.tag;
        document.getElementById('uifparent').style.display = 'flex';
        document.getElementById('uifabm').innerHTML = converty.makeHtml(res.aboutMe.text);
        if (res.aboutMe.premyum) {
            document.getElementById('neetro').hidden = false;
        } else {
            document.getElementById('neetro').hidden = true;
        }
    });
}

function au() {
    if (document.getElementById("acsabm").innerText != abm && document.getElementById("acsabm").innerText.length <= 2000) {
        abm = document.getElementById("acsabm").innerText;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", authUrl + '/abmcfg?id='+localStorage.getItem("sid"), true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(JSON.stringify({text:abm}));
    }
    if (document.getElementById("acsusername").innerText != oldunam && document.getElementById("acsusername").innerText.length <= 30) {
        if (premyum) return;
        oldunam = document.getElementById("acsusername").innerText;
        if (oldunam.length < 1) {
            fetchUser(localStorage.getItem('sid')).then((res) => {
                oldunam = res.unam;
            });
            return;
        }
        const hrx = new XMLHttpRequest();
        hrx.open("GET", authUrl + '/unamcfg?id='+localStorage.getItem("sid")+'&unam='+encodeURIComponent(oldunam), true);
        hrx.send();
    }
}
