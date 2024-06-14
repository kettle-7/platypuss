 /************************************************************************
 * Copyright 2020-2024 Ben Keppel, Marley Carroll                        *
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

// The return of the Kettle3D®™ Tilde Faces©®™ is neigh :~)

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
var edit = false;
var shown = null;
if (!authUrl) authUrl = "https://platypuss.net";
var rgbcolourchangeinterval;

var mainContentContainer = document.getElementById("mainContentContainer"),
    acceptinvitebtn = document.getElementById("acceptinvitebtn"),
    loadingScreen = document.getElementById("loadingScreen"),
    inviteparent = document.getElementById("inviteparent"),
    loadingText = document.getElementById("loadingText"),
    mainContent = document.getElementById("mainContent"),
    invitepopup = document.getElementById("invitepopup"),
    invdecline = document.getElementById("invdecline"),
    almostbody = document.getElementById("almostbody"),
    serverName = document.getElementById("serverName"),
    progress2 = document.getElementById("progress2"),
    progress = document.getElementById("progress"),
    msgtxt = document.getElementById("msgtxt"),
    lit1 = document.getElementById("lit1"),
    lit2 = document.getElementById("lit2"),
    lit3 = document.getElementById("lit3");

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

function inviteError (err) {
    console.error(err);
    serverName.innerHTML = `
    You've been invited to join a server, but we couldn't connect.<br>
    Either the invite link is invalid or the server is currently down.
    Please contact the server owner if you think there's an issue.
    `;
    acceptinvitebtn.innerText = "Accept Anyway";
    document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
    loadingScreen.className += " fadeOut";
    invdecline.focus();
}

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
    lit1.innerHTML = lit1.innerHTML.replace(/Create Account/g, "Sign In");
    lit2.innerHTML = 'Welcome back! If you don\'t already have an account <br> please <a href="#" onclick="su()">create an account</a> instead.';
    lit3.innerText = lit3.innerText.replace(/Create Account/g, "Sign In");
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
    lit1.innerHTML = lit1.innerHTML.replace(/Sign In/g, "Create Account");
    lit2.innerHTML = '<span id="lit2">Welcome to Platypuss! If this is not your first time with us <br> please <a href="#" onclick="li()"> \
sign in</a> instead. Please make sure to read the <br> <a href="/tos" target="_blank">terms of service</a> before creating an account.</span>';
    lit3.innerText = lit3.innerText.replace(/Sign In/g, "Create Account");
}

function doTheLoginThingy() {
    let unam = document.getElementById("unam").value;
    let email = document.getElementById("email").value;
    let pwd1 = document.getElementById("pwd1").value;
    if (ift) { // if you're making a new account rather than logging into an existing one
        let pwd2 = document.getElementById("pwd2").value;
        if (pwd1 != pwd2) {
            lit2.innerText = "Your passwords don't match.";
            return;
        }
        if (unam == "") {
            lit2.innerText = "Please fill this out, you can't just make an account without an username...";
            return;
        }
        if (pwd1 == "") {
            lit2.innerText = "Please fill this out, you can't just make an account without a password...";
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
                    lit2.innerHTML = 'You\'ve already made an account with that email address, would you like to <a onclick="li()">log in</a> instead?';
                    return;
                }
                lit2.innerHTML = 'An email has now been sent to that address, \
please check your inbox for a link to verify your account. After you\'ve done that you\'ll need to reload \
this page to join the server.';
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
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE && (req.status == 200 || req.status == 204)) {
            let res = JSON.parse(req.responseText);
            if (!res.exists) {
                lit2.innerHTML = "There's no account with that email address, would you like to <a onclick=\"su()\">make a new account</a> instead?";
                return;
            }
            if (!res.pwd) {
                lit2.innerHTML = "That password isn't correct, did you misspell it?";
                return;
            }
            localStorage.setItem('sid', res.sid);
            window.location.reload();
        }
    };
    req.send(jsonobjectforloggingin);
}

fetchUser(localStorage.getItem('sid')).then((res) => {
    if (window.location.toString().includes("chausdhsa89h98q3hai")) {
        document.getElementById("ptitle").innerHTML = "chausdhsa89h98q3hai";
        document.getElementById("htitle").innerHTML = "chausdhsa89h98q3hai";
    }
    if (res == null || localStorage.getItem('sid') == null) {
        loggedin = false;
        document.head.removeChild(document.getElementById("ss0"));
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
            else {
                almostbody.style.opacity = 0.1;
                setInterval(() => {
                    document.body.style.backgroundColor = changeHue(document.body.style.backgroundColor, 5 - Math.random() * 7.5);
                }, 5);
            }
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
        document.getElementById("upload").addEventListener('click', e => {
            var input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = e => { 
                const files = e.target.files;
                for (let file of files) {
                    if (Object.keys(uploadQueue).every(f => uploadQueue[f].name !== file.name)) {
                        file.id = Math.random().toString().replace(/[.]/g, ""); // should be good
                        uploadQueue[file.id] = file;
                        document.getElementById("fileDeleteMessage").hidden = false;
                        // TODO: display an icon for files that aren't images
                        document.getElementById("fileUploadSpace").innerHTML += 
`<img class="avatar" id="${file.id}" src="${URL.createObjectURL(file)}"
    onclick="delete uploadQueue['${file.id}'];
        if (Object.keys(uploadQueue).length == 0) {
            document.getElementById('fileDeleteMessage').hidden = true;
        }
        this.parentElement.removeChild(this);"/>`;
                    }
                }
                acceptinvitebtn.focus();
            };
            input.click();
        });
        mainContentContainer.addEventListener("drop", (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            for (let file of files) {
                if (Object.keys(uploadQueue).every(f => uploadQueue[f].name !== file.name)) {
                    file.id = Math.random().toString().replace(/[.]/g, ""); // should be good
                    uploadQueue[file.id] = file;
                    document.getElementById("fileDeleteMessage").hidden = false;
                    // TODO: display an icon for files that aren't images
                    document.getElementById("fileUploadSpace").innerHTML += 
`<img class="avatar" id="${file.id}" src="${URL.createObjectURL(file)}"
    onclick="delete uploadQueue['${file.id}'];
        if (Object.keys(uploadQueue).length == 0) {
            document.getElementById('fileDeleteMessage').hidden = true;
        }
        this.parentElement.removeChild(this);"/>`;
                }
            }
            msgtxt.focus();
        });
        
        if (url.searchParams.has("invite")) {
            let inviteCode = url.searchParams.get("invite");
            let ip = [ // the first 8 characters are the ip address in hex form
                Number("0x"+inviteCode[0]+inviteCode[1]).toString(),
                Number("0x"+inviteCode[2]+inviteCode[3]).toString(),
                Number("0x"+inviteCode[4]+inviteCode[5]).toString(),
                Number("0x"+inviteCode[6]+inviteCode[7]).toString()].join(".");
            let ogip = ip;
            if (url.searchParams.has("invip")) {
                ip = url.searchParams.get("invip");
            }
            let port = 0;
            for (let c = 8; c + 2 < inviteCode.length; c++) {
                port = port * 16 + parseInt(inviteCode[c], 16);
            }
            let code = Number("0x"+inviteCode[inviteCode.length - 2]+inviteCode[inviteCode.length - 1]).toString();
            fetch(`http${url.protocol == "https:" ? "s" : ""}://${ip}:${port}/${ogip}`).then(res => {
                res.json().then(data => {
                    if (data.description == undefined) {
                        data.description = "This server has no description, it's too cool to be described.";
                    }
                    document.getElementById("serinvitetitle").innerText = data.title.toString();
                    serverName.innerHTML = `
                    You've been invited to join ${data.title}
                    <br>IP: ${ip}:${port}
                    <br>${data.memberCount} members
                    <p>${converty.makeHtml(data.description.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;"))}</p>
                    `;
                    document.getElementById("inviteIcon").src = data.icon;
                    loadingScreen.className += " fadeOut";
                    acceptinvitebtn.focus();
                }).catch(inviteError);
            }).catch(inviteError);
            inviteparent.style.display = "flex";
            function clicky () {
                invdecline.innerText = "Close";
                invitepopup.removeChild(acceptinvitebtn);
                const r = new XMLHttpRequest();
                r.open("GET", authUrl+`/joinserver?id=${localStorage.getItem("sid")}&ip=${ip}:${port}+${code}+${ogip}`);
                r.onload = () => {
                    if (r.status == 200) {
                        almostbody.removeChild(inviteparent);
                        window.history.pushState({}, '', '/chat');
                        clientLoad();
                    } else {
                        serverName.innerHTML = "Couldn't join the server, try again later?";
                    }
                }
                r.send(null);
            }
            localStorage.removeItem("pendingInvite");
            localStorage.removeItem("pendingInvip");
            acceptinvitebtn.addEventListener("click", clicky);
        } else if (localStorage.getItem("pendingInvite") != null) {
            let inviteCode = localStorage.getItem("pendingInvite");
            let ip = [ // the first 8 characters are the ip address in hex form
                Number("0x"+inviteCode[0]+inviteCode[1]).toString(),
                Number("0x"+inviteCode[2]+inviteCode[3]).toString(),
                Number("0x"+inviteCode[4]+inviteCode[5]).toString(),
                Number("0x"+inviteCode[6]+inviteCode[7]).toString()].join(".");
            let ogip = ip;
            if (localStorage.getItem("pendingInvip")) {
                ip = localStorage.getItem("pendingInvip");
            }
            let port = 0;
            for (let c = 8; c + 2 < inviteCode.length; c++) {
                port = port * 16 + parseInt(inviteCode[c], 16);
            }
            let code = Number("0x"+inviteCode[inviteCode.length - 2]+inviteCode[inviteCode.length - 1]).toString();
            fetch(`http${url.protocol == "https:" ? "s" : ""}://${ip}:${port}/${ogip}`).then(res => {
                res.json().then(data => {
                    if (data.description == undefined) {
                        data.description = "This server has no description, it's too cool to be described.";
                    }
                    document.getElementById("serinvitetitle").innerText = data.title.toString();
                    serverName.innerHTML = `
                    You've been invited to join ${data.title}
                    <br>IP: ${ip}:${port}
                    <br>${data.memberCount} members
                    <p>${converty.makeHtml(data.description.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;"))}</p>
                    `;
                    document.getElementById("inviteIcon").src = data.icon;
                    loadingScreen.className += " fadeOut";
                    acceptinvitebtn.focus();
                }).catch(inviteError);
            }).catch(inviteError);
            inviteparent.style.display = "flex";
            localStorage.removeItem("pendingInvite");
            localStorage.removeItem("pendingInvip");
            function clicky () {
                invdecline.innerText = "Close";
                invitepopup.removeChild(acceptinvitebtn);
                const r = new XMLHttpRequest();
                r.open("GET", authUrl+`/joinserver?id=${localStorage.getItem("sid")}&ip=${ip}:${port}+${code}+${ogip}`);
                r.onload = () => {
                    if (r.status == 200) {
                        almostbody.removeChild(inviteparent);
                        window.history.pushState({}, '', '/chat');
                        clientLoad();
                    } else {
                        serverName.innerHTML = "Couldn't join the server, try again later?";
                    }
                }
                r.send(null);
            }
            acceptinvitebtn.addEventListener("click", clicky);
        } else {
            const h = new XMLHttpRequest();
            h.open('GET', authUrl+'/sload?id='+localStorage.getItem('sid'), true);
            h.onload = () => {
                if (h.status != 200) {
                    localStorage.removeItem("sid");
                    if (url.searchParams.has("invite")) localStorage.setItem("pendingInvite", url.searchParams.get("invite"));
                    if (url.searchParams.has("invip")) localStorage.setItem("pendingInvip", url.searchParams.get("invip"));
                    window.location = "/";
                }
                let sers = JSON.parse(h.responseText);
                if (Object.keys(sers.servers).length === 0 && !url.searchParams.has("invite") && !localStorage.getItem("pendingInvite")) { // None
                    window.location = "/";
                }
            };
            h.send();
            clientLoad();
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
                        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
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
        }
    }
    else {
        if (url.searchParams.has("invite")) {
            let inviteCode = url.searchParams.get("invite");
            let ip = [ // the first 8 characters are the ip address in hex form
                Number("0x"+inviteCode[0]+inviteCode[1]).toString(),
                Number("0x"+inviteCode[2]+inviteCode[3]).toString(),
                Number("0x"+inviteCode[4]+inviteCode[5]).toString(),
                Number("0x"+inviteCode[6]+inviteCode[7]).toString()].join(".");
            let ogip = ip;
            if (url.searchParams.has("invip")) {
                ip = url.searchParams.get("invip");
            }
            let port = 0;
            for (let c = 8; c + 2 < inviteCode.length; c++) {
                port = port * 16 + parseInt(inviteCode[c], 16);
            }
            let code = Number("0x"+inviteCode[inviteCode.length - 2]+inviteCode[inviteCode.length - 1]).toString();
            fetch(`http${url.protocol == "https:" ? "s" : ""}://${ip}:${port}/${ogip}`).then(res => {
                res.json().then(data => {
                    if (data.description == undefined) {
                        data.description = "This server has no description, it's too cool to be described.";
                    }
                    document.getElementById("serinvitetitle").innerText = data.title.toString();
                    serverName.innerHTML = `
                    You've been invited to join ${data.title}
                    <br>IP: ${ip}:${port}
                    <br>${data.memberCount} members
                    <p>${converty.makeHtml(data.description.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;"))}</p>
                    `;
                    document.getElementById("inviteIcon").src = data.icon;
                    loadingScreen.className += " fadeOut";
                    acceptinvitebtn.focus();
                }).catch(inviteError);
            }).catch(inviteError);
            inviteparent.style.display = "flex";
            function clicky () {
                invdecline.innerText = "Close";
                invitepopup.removeChild(acceptinvitebtn);
                invitepopup.style.display = "none";
                su();
            }
            localStorage.removeItem("pendingInvite");
            localStorage.removeItem("pendingInvip");
            acceptinvitebtn.addEventListener("click", clicky);
        } else if (localStorage.getItem("pendingInvite") != null) {
            let inviteCode = localStorage.getItem("pendingInvite");
            let ip = [ // the first 8 characters are the ip address in hex form
                Number("0x"+inviteCode[0]+inviteCode[1]).toString(),
                Number("0x"+inviteCode[2]+inviteCode[3]).toString(),
                Number("0x"+inviteCode[4]+inviteCode[5]).toString(),
                Number("0x"+inviteCode[6]+inviteCode[7]).toString()].join(".");
            let ogip = ip;
            if (localStorage.getItem("pendingInvip")) {
                ip = localStorage.getItem("pendingInvip");
            }
            let port = 0;
            for (let c = 8; c + 2 < inviteCode.length; c++) {
                port = port * 16 + parseInt(inviteCode[c], 16);
            }
            let code = Number("0x"+inviteCode[inviteCode.length - 2]+inviteCode[inviteCode.length - 1]).toString();
            fetch(`http${url.protocol == "https:" ? "s" : ""}://${ip}:${port}/${ogip}`).then(res => {
                res.json().then(data => {
                    if (data.description == undefined) {
                        data.description = "This server has no description, it's too cool to be described.";
                    }
                    document.getElementById("serinvitetitle").innerText = data.title.toString();
                    serverName.innerHTML = `
                    You've been invited to join ${data.title}
                    <br>IP: ${ip}:${port}
                    <br>${data.memberCount} members
                    <p>${converty.makeHtml(data.description.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;"))}</p>
                    `;
                    document.getElementById("inviteIcon").src = data.icon;
                    loadingScreen.className += " fadeOut";
                    acceptinvitebtn.focus();
                }).catch(inviteError);
            }).catch(inviteError);
            inviteparent.style.display = "flex";
            localStorage.removeItem("pendingInvite");
            localStorage.removeItem("pendingInvip");
            function clicky () {
                invdecline.innerText = "Close";
                invitepopup.removeChild(acceptinvitebtn);
                invitepopup.style.display = "none";
                su();
            }
            acceptinvitebtn.addEventListener("click", clicky);
        } else {
            window.location = "/";
        }
    }
}, () => {
    loadingText.innerHTML = "Something went wrong, click <a href='/'>here</a> to return to our homepage."
});

document.getElementById("accountInfo").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});
document.getElementById("invitepopup").addEventListener("mousedown", (e) => {
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
document.getElementById("uifpopup").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});
document.getElementById("fuckyoupopup").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        au();
        for (let e of [
            "accountInfoParent",
            "inviteparent",
            "acsparent",
            "uifparent",
            "dacparent",
            "cpwdparent"
        ]) {
            document.getElementById(e).style.display = "none";
        }
    }
});

if (authUrl != url.protocol + "//" + url.host && (url.protocol == "http:" || url.protocol == "https:") && !localStorage.getItem("forceAuth")) {
    localStorage.setItem("authUrl", url.protocol + "//" + url.host);
    window.location.reload();
}

function logout() {
    localStorage.removeItem("sid");
    window.location = "/";
}

var sockets = {};
var loadedMessages = 0;
var focusedServer;
var reply;
var peers = {};
var lastMessageAuthor = null;

function deleteMessage(id, server) {
    if (premyum) {
        mainContent.innerHTML += 
        '<div class="message1">Y o u<br>c a n \' t<br>d o<br>t h a t</div>';
        return;
    }
    sockets[server].send(JSON.stringify({
        eventType: "messageDelete",
        id: id
    }));
    msgtxt.focus();
}

function editMessage(id, server) {
    if (premyum) {
        mainContent.innerHTML += 
        '<div class="message1">Y o u<br>c a n \' t<br>d o<br>t h a t</div>';
        return;
    }
    edit = id;
    msgtxt.value = messageMap[id].content;
    msgtxt.focus();
}

function replyTo(id, server) {
    if (premyum) {
        mainContent.innerHTML += 
        '<div class="message1">Y o u<br>c a n \' t<br>d o<br>t h a t</div>';
        return;
    }
    if (reply) {
        document.getElementById(`message_${reply}`).style.borderLeftWidth = "0px";
        document.getElementById(`message_${reply}`).style.borderLeftColor = "transparent";
    }
    reply = id;
    document.getElementById(`message_${reply}`).style.borderLeftWidth = "2px";
    document.getElementById(`message_${reply}`).style.borderLeftColor = "#0075DB";
    msgtxt.focus();
}

function userInfo(id) {
    shown = id;
    fetchUser(id).then(res => {
        document.getElementById("uifpfp").src = authUrl + res.pfp;
        document.getElementById("uifusername").innerText = res.unam;
        document.getElementById("uiftag").innerText = "@" + res.tag;
        document.getElementById('uifparent').style.display = 'flex';
        document.getElementById('uifabm').innerHTML = converty.makeHtml(res.aboutMe.text.replace(/\</g, "&lt;"));
        if (res.aboutMe.premyum) {
            document.getElementById('neetro').hidden = false;
        } else {
            document.getElementById('neetro').hidden = true;
        }
        if (!document.getElementById("userInfoAdminActions").hidden) {
            for (let checkbox in checkboxes) {
                checkboxes[checkbox].checked = peers[id].globalPermissions.includes(checkbox);
                checkboxes[checkbox].onchange = () => {
                    console.log(JSON.stringify({
                        eventType: "permissionChange",
                        uid: id,
                        permission: checkbox,
                        value: checkboxes[checkbox].checked
                    }));
                    sockets[focusedServer].send(JSON.stringify({
                        eventType: "permissionChange",
                        uid: id,
                        permission: checkbox,
                        value: checkboxes[checkbox].checked
                    }));
                }
            }
        }
    });
}

function ping(id) {
    if (premyum) {
        mainContent.innerHTML += 
        '<div class="message1">Y o u<br>c a n \' t<br>d o<br>t h a t</div>';
        return;
    }
    msgtxt.value += ` [@${id}] `;
    msgtxt.focus();
}

function moreMessages() {
    sockets[focusedServer].send(JSON.stringify({
        eventType: "messageLoad",
        max: 100,
        start: loadedMessages
    }));
}

function sban(unban) {
    sockets[focusedServer].send(JSON.stringify({
        eventType: "ban",
        uid: shown,
        unban: unban
    }))
}

function au() {
    if (document.getElementById("acsabm").value != abm && document.getElementById("acsabm").value.length <= 2000) {
        abm = document.getElementById("acsabm").value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", authUrl + '/abmcfg?id='+localStorage.getItem("sid"), true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(JSON.stringify({text:abm}));
    }
    if (document.getElementById("acsusername").innerText != oldunam && document.getElementById("acsusername").innerText.length <= 30) {
        if (premyum) {
            mainContent.innerHTML += 
            '<div class="message1">Y o u<br>c a n \' t<br>d o<br>t h a t</div>';
            return;
        }
        oldunam = document.getElementById("acsusername").innerText;
        const hrx = new XMLHttpRequest();
        hrx.open("GET", authUrl + '/unamcfg?id='+localStorage.getItem("sid")+'&unam='+encodeURIComponent(oldunam), true);
        hrx.send();
    }
}

function siv(mid) {
    let m = document.getElementById(`message_${mid}`);
    m.scrollIntoView();
    m.className += " pulsating";
    let ma = document.getElementById("messageArea");
    if (ma.scrollTop + ma.clientHeight < ma.scrollHeight)
    ma.scrollTo(ma.scrollLeft, ma.scrollTop - ma.clientHeight / 2);
}

// should also work on regular files
function imageUpload(imgs, callback) {
    if (imgs.length < 1) {
        callback(null);
        return true;
    } else if (premyum) {
        mainContent.innerHTML += 
        '<div class="message1">Y o u<br>c a n \' t<br>d o<br>t h a t</div>';
        callback(null);
        return true;
    }
    const formData = new FormData();
    imgs.forEach((image, index) => {
        formData.append(image.name, image);
    });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", authUrl+`/upload?id=${localStorage.getItem("sid")}`);
    xhr.onreadystatechange = () => {
        progress.hidden = true;
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
            callback(xhr.responseText);
            acceptinvitebtn.focus();
        }
    };
    progress.hidden = false;
    xhr.upload.onprogress = (e) => {
        progress2.style.marginRight = `${100-(e.loaded/e.total*100)}%`
    };
    xhr.send(formData);
}

function ke(e) {
    let ws = sockets[focusedServer];
    if (e.key == "Enter") {
        if (e.shiftKey) {
            if (msgtxt.rows < 10)
                msgtxt.rows += 1;
            return;
        }
        progress.innerHTML = '<div id="progress2"></div>';
        imageUpload(Object.values(uploadQueue), res => {
            let uploads = [];
            if (res) {
                if (res[0] == "E") {
                    progress.innerText = res;
                    progress.hidden = false;
                    progress.style.marginRight = "100%";
                    return;
                }
                try {
                    responseText = JSON.parse(res);
                } catch (e) {
                    console.error(e);
                }
                for (let u of responseText) {
                    uploads.push({"url": u.url, "type": u.type, "name": u.name});
                }
            }
            if (edit == false) {
                ws.send(JSON.stringify({
                    eventType: "message",
                    message: { content: msgtxt.value, reply: reply ? reply : undefined, uploads: uploads ? uploads : undefined }
                }));
            } else {
                ws.send(JSON.stringify({
                    eventType: "messageEdit",
                    id: edit,
                    message: { content: msgtxt.value }
                }));
                edit = false;
            }
            msgtxt.value = "";
            msgtxt.rows = 2;
            if (reply) {
                document.getElementById(`message_${reply}`).style.borderLeftWidth = "0px";
                document.getElementById(`message_${reply}`).style.borderLeftColor = "transparent";
            }
            reply = false;
            uploadQueue = {};
            document.getElementById("fileUploadSpace").innerHTML = "";
            document.getElementById("fileDeleteMessage").hidden = true;
        });
        e.preventDefault();
    }
}

function ce(e) {
    let ws = sockets[focusedServer];
    imageUpload(Object.values(uploadQueue), res => {
        let uploads = [];
        if (res) {
            if (res[0] == "E") {
                progress.innerText = res;
                progress.hidden = false;
                progress.style.marginRight = "100%";
                return;
            }
            responseText = JSON.parse(res);
            for (let u of responseText) {
                uploads.push({"url": u.url, "type": u.type, "name": u.name});
            }
        }
        if (!edit)
            ws.send(JSON.stringify({
                eventType: "message",
                message: { content: msgtxt.value, reply: reply ? reply : undefined, uploads: uploads ? uploads : undefined }
            }));
        else {
            ws.send(JSON.stringify({
                eventType: "messageEdit",
                id: edit,
                message: { content: msgtxt.value }
            }));
            edit = false;
        }
        msgtxt.value = "";
        msgtxt.rows = 2;
        if (reply) {
            document.getElementById(`message_${reply}`).style.borderLeftWidth = "0px";
            document.getElementById(`message_${reply}`).style.borderLeftColor = "transparent";
        }
        reply = false;
        uploadQueue = {};
        document.getElementById("fileUploadSpace").innerHTML = "";
        document.getElementById("fileDeleteMessage").hidden = true;
        msgtxt.focus();
    });
}

msgtxt.addEventListener("paste", function (e) {
    console.log(e.clipboardData.getData("url"), e.clipboardData.files);
    
    mainContentContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        const files = e.clipboardData.files;
        for (let file of files) {
            console.log(file);
            if (Object.keys(uploadQueue).every(f => uploadQueue[f].name !== file.name)) {
                file.id = Math.random().toString().replace(/[.]/g, ""); // should be good
                uploadQueue[file.id] = file;
                document.getElementById("fileDeleteMessage").hidden = false;
                // TODO: display an icon for files that aren't images
                document.getElementById("fileUploadSpace").innerHTML += 
`<img class="avatar" id="${file.id}" src="${URL.createObjectURL(file)}"
onclick="delete uploadQueue['${file.id}'];
    if (Object.keys(uploadQueue).length == 0) {
        document.getElementById('fileDeleteMessage').hidden = true;
    }
    this.parentElement.removeChild(this);"/>`;
            }
        }
        msgtxt.focus();
    });
});

msgtxt.addEventListener("keypress", ke);
document.getElementById("send").addEventListener("click", ce);
var elapsed;
var breaks = [];
var checkboxes = {};
var globalPermissions = [];

function clientLoad() {
    for (let socket of Object.values(sockets)) {
        socket.close();
    }
    for (let bread of breaks) {
        clearTimeout(bread);
    }
    elapsed = false;
    sockets = {};
    peers = {};
    globalPermissions = [];
    let opensocks = 0;
    let ips = [];
    lastMessageAuthor = null;
    document.getElementById("loadMoreMessages").hidden = false;
    mainContent.innerHTML = "";
    document.getElementById("left").innerHTML = "";
    document.getElementById("right").innerHTML = "peers";
    let ma = document.getElementById("messageArea");
    const h = new XMLHttpRequest();
    h.open('GET', authUrl+'/sload?id='+localStorage.getItem('sid'), true);
    h.onload = () => {
        if (h.status != 200) {              // warning: this code might fail if something has gone wrong, and thus cause the 
            localStorage.removeItem("sid"); // page to infinitely reload. the most likely response from the user is the
            window.location = "/";          // page being closed and mild confusion which is not ideal but not dangerous.
        }

        setTimeout(() => {
            if (opensocks < 1) {
                loadingScreen.className += " fadeOut";
            }
        }, 3000);

        let sers = JSON.parse(h.responseText);
        for (let serveur in sers.servers) {
            async function load() {
            if (ips.includes(serveur)) return;
            ips.push(serveur);
            let ip = serveur.split(' ')[0];
            let code = serveur.split(' ')[1];
            let ogip = serveur.split(' ')[2];
            let surl = ((url.protocol == "https:" ? "wss" : "ws") + "://"+ip.toString());
            let ws = new WebSocket(surl);
            document.getElementById("left").innerHTML = "";
            document.getElementById("right").innerHTML = "peers";
            breaks.push(setTimeout(() => {
                if (ws.readyState == 0) {
                    ws.close();
                }
                elapsed = true;
            }, 60000));
            ws.onerror = () => {
                console.error(`Warning: couldn't connect to ${ip}, try check your internet connection or inform the owner(s) of the server.`);
                if (elapsed && focusedServer == serveur) clientLoad();
            };
            ws.onopen = () => {
                opensocks++;
                sockets[serveur] = ws;
                ws.send(JSON.stringify({
                    eventType: "login",
                    ogip: ogip,
                    code: code,
                    sid: sers.servers[serveur]
                }));
            };
            ws.onclose = () => {
                console.error(`Warning: the server at ${ip} closed.`);
                if (elapsed && focusedServer == serveur) clientLoad();
            };
            ws.onmessage = async (event) => {
                let packet = JSON.parse(event.data);
                let unam, pfp;
                switch (packet.eventType) {
                    case "message":
                        if (premyum) document.getElementById('fuckyouparent').style.display = 'flex';
                        if (focusedServer == serveur) {
                            loadedMessages++;
                            messageMap[packet.message.id] = packet.message;
                            // looks like absolute gibberish, matches uuids
                            let uuidreg = /[0-9a-f]{7,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
                            let msgtext = converty.makeHtml(packet.message.content.replace(/\</g, '&lt;')/*.replace(/\>/g, '&gt;')*/);
                            let arr;
                            while ((arr = uuidreg.exec(msgtext)) !== null) {
                                let strl = msgtext.split("");
                                if (strl[arr.index + 35] == "]") {
                                    strl.splice(arr.index, 0, "0");
                                }
                                if (strl[arr.index + 36] != "]" || strl[arr.index - 2] != "[") {
                                    continue;
                                }
                                let t = strl[arr.index - 1];
                                switch(t) {
                                    case "@":
                                        let user = await fetchUser(arr[0]);
                                        if (user == null) {
                                            strl.splice(arr.index - 2, 39, `<a class="invalidUser">@Deleted User</a>`);
                                        } else {
                                            // we don't support server nicknames as they don't exist yet
                                            strl.splice(arr.index - 2, 39, `
<a class="userMention" onclick="userInfo('${user.id}');">@${user.unam}</a>`);
                                        }
                                        msgtext = strl.join("");
                                        //uuidreg.exec(msgtxt);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if (packet.message.reply) {
                                if (!messageMap[packet.message.reply]) {
                                    msgtext = `<blockquote id="r_${packet.message.id}"><em>Message couldn't be loaded</em></blockquote>` + msgtext;
                                    if (mRef[packet.message.reply] == undefined) {
                                        mRef[packet.message.reply] = [`r_${packet.message.id}`];
                                    } else {
                                        mRef[packet.message.reply].push(`r_${packet.message.id}`);
                                    }
                                } else {
                                    let m = await fetchUser(messageMap[packet.message.reply].author);
                                    if (m == null) {
                                        msgtext = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply
                                            }')"><a class="invalidUser">@Deleted User</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtext;
                                    } else {
                                        // we don't support server nicknames as they don't exist yet
                                        msgtext = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply
}')"><a class="userMention" onclick="userInfo('${m.id}');">@${m.unam
                                            .replace(/\</g, "&lt;")
                                            .replace(/\>/g, "&gt;")
                                        }</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtext;
                                    }
                                }
                            }

                            if (packet.message.uploads) {
                                for (let upload of packet.message.uploads) {
                                    if (upload.type.startsWith("image/") && !premyum) {
                                        msgtext += `<a target="_blank" href="${authUrl+upload.url}"><img src="${authUrl+upload.url}"></a>`;
                                        continue;
                                    } else if (upload.type.startsWith("video/") && !premyum) {
                                        msgtext += `<video controls height="250">
                                        <source src="${authUrl+upload.url}" type="${upload.type}" /></video>`;
                                    }
                                    msgtext += `
                                        <div class="upload">
                                            <span class="material-symbols-outlined">draft</span><a class="uploadName" target="_blank" href="${authUrl+upload.url}">${upload.name}</a>
                                        </div>`;
                                }
                            }

                            if (sers.userId == "a1f762e9-81a4-41ad-90f0-3f351a45b94d" && premyum) {
                                msgtext = "Squawk ! :3";
                            }

                            fetchUser(packet.message.author).then((resp) => {
                                if (resp == null) { // this should never happen
                                    unam = "Deleted User";
                                    pfp = "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg";
                                    if (mRef[packet.message.id] !== undefined) { // and this *definitely* shouldn't
                                        for (let meg of mRef[packet.message.id]) {
                                            let mog = document.getElementById(meg);
                                            mog.innerHTML = `<a class="invalidUser">@Deleted User</a> ${packet.message.content}`;
                                            mog.style.cursor = "pointer";
                                            mog.addEventListener("click", () => { siv(packet.message.id) });
                                        }
                                    }
                                }
                                else {
                                    unam = resp.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                                    pfp = authUrl + resp.pfp;
                                    if (mRef[packet.message.id] !== undefined) {
                                        for (let meg of mRef[packet.message.id]) {
                                            let mog = document.getElementById(meg);
                                            mog.innerHTML = `<a class="userMention" onclick="userInfo(${resp.id})">@${unam}</a>
                                                ${packet.message.content}`;
                                            mog.style.cursor = "pointer";
                                            mog.addEventListener("click", () => { siv(packet.message.id) });
                                        }
                                    }
                                }
                                let message3;
                                if (packet.message.author == sers.userId) {
                                    message3 = `
                                    <div class="message3">
                                        ${!premyum && lastMessageAuthor === packet.message.author && !(packet.message.content.startsWith("#")) ? `<span class="timestomp" style="position:relative;top:5px;">@${resp ? resp.tag : "None"} at ${new Date(packet.message.stamp).toLocaleString()}${packet.message.edited ? ", last edited "+new Date(packet.message.edited).toLocaleString() : ""}</span>` : ""}
                                        <button class="material-symbols-outlined" onclick="editMessage('${packet.message.id}', '${serveur}');">Edit</button>
                                        ${globalPermissions.includes("message.delete") ? `<button class="material-symbols-outlined" onclick="deleteMessage('${packet.message.id}', '${serveur}');">Delete</button>` : ""}
                                        <button class="material-symbols-outlined" onclick="replyTo('${packet.message.id}', '${serveur}');">Reply</button>
                                    </div>`;
                                } else {
                                    message3 = `
                                    <div class="message3">
                                        ${!premyum && lastMessageAuthor === packet.message.author && !(packet.message.content.startsWith("#")) ? `<span class="timestomp" style="position:relative;top:5px;">@${resp ? resp.tag : "None"} at ${new Date(packet.message.stamp).toLocaleString()}${packet.message.edited ? ", last edited "+new Date(packet.message.edited).toLocaleString() : ""}</span>` : ""}
                                        <button class="material-symbols-outlined" onclick="ping('${packet.message.author}');">alternate_email</button>
                                        ${globalPermissions.includes("moderation.delete") ? `<button class="material-symbols-outlined"
                                        onclick="deleteMessage('${packet.message.id}', '${serveur}');">Delete</button>` : ""}
                                        <button class="material-symbols-outlined" onclick="replyTo('${packet.message.id}', '${serveur}');">Reply</button>
                                    </div>`;
                                }
                                
                                if (packet.message.special) {
                                    message3 = ``;
                                    txt += `
                                    <div class="message1" id="message_${packet.message.id}">
                                        <span>${msgtext}</span><span class="timestomp">${packet.message.stamp == undefined ? "" : " at " + new Date(packet.message.stamp).toLocaleString()}</span>
                                    </div>
                                    `;
                                } else if (!premyum && lastMessageAuthor === packet.message.author && !(packet.message.content.startsWith("#"))) {
                                    mainContent.innerHTML += `
                                    <div class="message1" id="message_${packet.message.id}">
                                        <div style="width:48px;flex-shrink:0;"></div>
                                        <div class="message2">
                                            <p>${msgtext}</p>
                                        </div>${message3}
                                    </div>
                                    `;
                                } else {
                                    mainContent.innerHTML += `
                                    <div class="message1" id="message_${packet.message.id}">
                                        <img src="${pfp}" class="avatar" onclick="userInfo('${packet.message.author}');"/>
                                        <div class="message2">
                                        <span><strong class="chonk" onclick="userInfo('${packet.message.author}');">${unam
                                            }</strong><span class="timestomp">@${resp ? resp.tag : "None"} at ${new Date(packet.message.stamp).toLocaleString()}${packet.message.edited ? ", last edited "+new Date(packet.message.edited).toLocaleString() : ""}</span></span>
                                            <p>${msgtext}</p>
                                        </div>${message3}
                                    </div>
                                    `;
                                    lastMessageAuthor = packet.message.author;
                                }
                                if (ma.scrollHeight < ma.scrollTop  + (2 * ma.clientHeight)) {
                                    if (premyum) {
                                        mainContent.innerHTML += 
                                        '<div class="message1">You\'ve got mail!</div>';
                                    }
                                    else ma.scrollTo(ma.scrollLeft, ma.scrollHeight - ma.clientHeight);
                                }
                                if (document.visibilityState == "hidden" && sers.userId != packet.message.author)
                                    new Audio(authUrl+'/randomsand.wav').play();
                            });
                        }
                        break;
                    case "messages":
                        let lastMessagesAuthor = null;
                        if (serveur != focusedServer) break;
                        let txt = "";
                        if (packet.messages == []) {
                            break;
                        }
                        let scrollBottom = ma.scrollHeight - ma.scrollTop;
                        for (let m = 0; m < packet.messages.length; m++) {
                            messageMap[packet.messages[m].id] = packet.messages[m];
                            loadedMessages++;
                            if (document.getElementById(`message_${packet.messages[m].id}`)) {
                                continue;
                            }
                            let uuidreg = /[0-9a-f]{7,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
                            let msgtext = converty.makeHtml(packet.messages[m].content.replace(/\</g, '&lt;')/*.replace(/\>/g, '&gt;')*/);
                            let arr;
                            while ((arr = uuidreg.exec(msgtext)) !== null) {
                                let strl = msgtext.split("");
                                if (strl[arr.index + 35] == "]") {
                                    strl.splice(arr.index, 0, "0");
                                }
                                if (strl[arr.index + 36] != "]" || strl[arr.index - 2] != "[") {
                                    continue;
                                }
                                let t = strl[arr.index - 1];
                                switch(t) {
                                    case "@":
                                        let user = await fetchUser(arr[0]);
                                        if (user == null) {
                                            strl.splice(arr.index - 2, 39, `<a class="invalidUser">@Deleted User</a>`);
                                        } else {
                                            // we don't support server nicknames as they don't exist yet
                                            strl.splice(arr.index - 2, 39, `
<a class="userMention" onclick="userInfo('${user.id}');">@${user.unam
                                                .replace(/\</g, "&lt;")
                                                .replace(/\>/g, "&gt;")}</a>`);
                                        }
                                        msgtext = strl.join("");
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if (packet.messages[m].reply) {
                                if (!messageMap[packet.messages[m].reply]) {
                                    msgtext = `<blockquote id="r_${packet.messages[m].id}"><em>Message couldn't be loaded</em></blockquote>` + msgtext;
                                    if (mRef[packet.messages[m].reply] == undefined) {
                                        mRef[packet.messages[m].reply] = [`r_${packet.messages[m].id}`];
                                    } else {
                                        mRef[packet.messages[m].reply].push(`r_${packet.messages[m].id}`);
                                    }
                                } else {
                                    let ms = await fetchUser(messageMap[packet.messages[m].reply].author);
                                    if (ms == null) {
                                        msgtext = `<blockquote style="cursor:pointer;" onclick="siv('${packet.messages[m].reply
                                            }')"><a class="invalidUser">@Deleted User</a> ${messageMap[packet.messages[m].reply].content}</blockquote>` + msgtext;
                                    } else {
                                        msgtext = `<blockquote style="cursor:pointer;" onclick="siv('${packet.messages[m].reply
}')"><a class="userMention" onclick="userInfo('${ms.id}');">@${ms.unam
                                            .replace(/\</g, "&lt;")
                                            .replace(/\>/g, "&gt;")
                                        }</a> ${messageMap[packet.messages[m].reply].content}</blockquote>` + msgtext;
                                    }
                                }
                            }

                            if (packet.messages[m].uploads) {
                                for (let upload of packet.messages[m].uploads) {
                                    if (upload.type.startsWith("image/") && !premyum) {
                                        msgtext += `<a target="_blank" href="${authUrl+upload.url}"><img src="${authUrl+upload.url}"></a>`;
                                        continue;
                                    } else if (upload.type.startsWith("video/") && !premyum) {
                                        msgtext += `<video controls height="250">
                                        <source src="${authUrl+upload.url}" type="${upload.type}" /></video>`;
                                    }
                                    msgtext += `
                                        <div class="upload">
                                            <span class="material-symbols-outlined">draft</span><a class="uploadName" target="_blank" href="${authUrl+upload.url}">${upload.name}</a>
                                        </div>`;
                                }
                            }
                            
                            let user = await fetchUser(packet.messages[m].author);
                            if (user == null) {
                                unam = "Deleted User";
                                pfp = "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg";
                                if (mRef[packet.messages[m].id] !== undefined) {
                                    for (let meg of mRef[packet.messages[m].id]) {
                                        let mog = document.getElementById(meg);
                                        mog.innerHTML = `<a class="invalidUser">@Deleted User</a> ${packet.messages[m].content}`;
                                        mog.style.cursor = "pointer";
                                        mog.addEventListener("click", () => { siv(packet.messages[m].id) });
                                    }
                                }
                            }
                            else {
                                unam = user.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                                pfp = authUrl + user.pfp;
                                if (mRef[packet.messages[m].id] !== undefined) {
                                    for (let meg of mRef[packet.messages[m].id]) {
                                        let mog = document.getElementById(meg);
                                        mog.innerHTML = `<a class="userMention" onclick="userInfo(${user.id})">@${unam}</a>
                                            ${packet.messages[m].content}`;
                                        mog.style.cursor = "pointer";
                                        mog.addEventListener("click", () => { siv(packet.messages[m].id) });
                                    }
                                }
                            }
                            let message3;
                            if (packet.messages[m].author == sers.userId) {
                                message3 = `
                                <div class="message3">
                                    ${lastMessagesAuthor === packet.messages[m].author && !(packet.messages[m].content.startsWith("#")) ? `<span class="timestomp" style="position:relative;top:5px;">@${user ? user.tag : "None"} at ${new Date(packet.messages[m].stamp).toLocaleString()}${packet.messages[m].edited ? ", last edited "+new Date(packet.messages[m].edited).toLocaleString() : ""}</span>` : ""}
                                    <button class="material-symbols-outlined" onclick="editMessage('${packet.messages[m].id}', '${serveur}');">Edit</button>
                                    ${globalPermissions.includes("message.delete") ? `<button class="material-symbols-outlined" onclick="deleteMessage('${packet.messages[m].id}', '${serveur}');">Delete</button>` : ""}
                                    <button class="material-symbols-outlined" onclick="replyTo('${packet.messages[m].id}', '${serveur}');">Reply</button>
                                </div>`;
                            } else {
                                message3 = `
                                <div class="message3">
                                    ${!premyum && lastMessagesAuthor === packet.messages[m].author && !(packet.messages[m].content.startsWith("#")) ? `<span class="timestomp" style="position:relative;top:5px;">@${user ? user.tag : "None"} at ${new Date(packet.messages[m].stamp).toLocaleString()}${packet.messages[m].edited ? ", last edited "+new Date(packet.messages[m].edited).toLocaleString() : ""}</span>` : ""}
                                    <button class="material-symbols-outlined" onclick="ping('${packet.messages[m].author}');">alternate_email</button>
                                    ${globalPermissions.includes("moderation.delete") ? `<button class="material-symbols-outlined"
                                    onclick="deleteMessage('${packet.messages[m].id}', '${serveur}');">Delete</button>` : ""}
                                    <button class="material-symbols-outlined" onclick="replyTo('${packet.messages[m].id}', '${serveur}');">Reply</button>
                                </div>`;
                            }
                            if (packet.messages[m].special) {
                                message3 = ``;
                                txt += `
                                <div class="message1" id="message_${packet.messages[m].id}">
                                    <span>${msgtext}</span><span class="timestomp">${packet.messages[m].stamp == undefined ? "" : " at " + new Date(packet.messages[m].stamp).toLocaleString()}</span>
                                </div>
                                `;
                            // lastMessagesAuthor
                            } else if (!premyum && lastMessagesAuthor === packet.messages[m].author && !(packet.messages[m].content.startsWith("#"))) {
                                txt += `
                                <div class="message1" id="message_${packet.messages[m].id}">
                                    <div style="width:48px;flex-shrink:0;"></div>
                                    <div class="message2">
                                        <p>${msgtext}</p>
                                    </div>${message3}
                                </div>
                                `;
                            } else {
                                txt += `
                                <div class="message1" id="message_${packet.messages[m].id}">
                                    <img src="${pfp}" class="avatar" onclick="userInfo('${packet.messages[m].author}');"/>
                                    <div class="message2">
                                        <span><strong class="chonk" onclick="userInfo('${packet.messages[m].author}');">${unam
                                        }</strong><span class="timestomp">@${user ? user.tag : "None"} at ${new Date(packet.messages[m].stamp).toLocaleString()}${packet.messages[m].edited ? ", last edited "+new Date(packet.messages[m].edited).toLocaleString() : ""}</span></span>
                                        <p>${msgtext}</p>
                                    </div>${message3}
                                </div>
                                `;
                                lastMessagesAuthor = packet.messages[m].author;
                            }
                            if (m + 1 == packet.messages.length) { // is this the last message
                                mainContent.innerHTML = txt + mainContent.innerHTML;
                                ma.scrollTo(ma.scrollLeft, ma.scrollHeight - scrollBottom);
                            }
                        }

                        if (packet.isTop) {
                            mainContent.innerHTML = `
<span class="message1" style="text-align: center; align-self: stretch;">
    You've reached the top! Well done.
</span>
` + mainContent.innerHTML;
                            document.getElementById("loadMoreMessages").hidden = true;
                        }
                        break;
                    case "rateLimit":
                        setTimeout(() => {
                            ws.send(JSON.stringify(packet.repeatedPacket));
                        }, packet.delay);
                        break;
                    case "messageDeleted":
                        if (focusedServer == serveur)
                            document.getElementById(`message_${packet.messageId}`).style.display = "none";
                        break;
                    case "messageEdited":
                        if (focusedServer !== serveur) break;
                        messageMap[packet.message.id] = packet.message;
                        // looks like absolute gibberish, matches uuids
                        let uuidreg = /[0-9a-f]{7,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
                        let msgtext = converty.makeHtml(packet.message.content.replace(/\</g, '&lt;')/*.replace(/\>/g, '&gt;')*/);
                        let arr;
                        while ((arr = uuidreg.exec(msgtext)) !== null) {
                            let strl = msgtext.split("");
                            if (strl[arr.index + 35] == "]") {
                                strl.splice(arr.index, 0, "0");
                            }
                            if (strl[arr.index + 36] != "]" || strl[arr.index - 2] != "[") {
                                continue;
                            }
                            let t = strl[arr.index - 1];
                            switch(t) {
                                case "@":
                                    let user = await fetchUser(arr[0]);
                                    if (user == null) {
                                        strl.splice(arr.index - 2, 39, `<a class="invalidUser">@Deleted User</a>`);
                                    } else {
                                        // we don't support server nicknames as they don't exist yet
                                        strl.splice(arr.index - 2, 39, `
<a class="userMention" onclick="userInfo('${user.id}');">@${user.unam}</a>`);
                                    }
                                    msgtext = strl.join("");
                                    //uuidreg.exec(msgtext);
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (packet.message.reply) {
                            if (!messageMap[packet.message.reply]) {
                                msgtext = `<blockquote id="r_${packet.message.id}"><em>Message couldn't be loaded</em></blockquote>` + msgtext;
                                if (mRef[packet.message.reply] == undefined) {
                                    mRef[packet.message.reply] = [`r_${packet.message.id}`];
                                } else {
                                    mRef[packet.message.reply].push(`r_${packet.message.id}`);
                                }
                            } else {
                                let m = await fetchUser(messageMap[packet.message.reply].author);
                                if (m == null) {
                                    msgtext = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply
                                        }')"><a class="invalidUser">@Deleted User</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtext;
                                } else {
                                    // we don't support server nicknames as they don't exist yet
                                    msgtext = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply
}')"><a class="userMention" onclick="userInfo('${m.id}');">@${m.unam
                                        .replace(/\</g, "&lt;")
                                        .replace(/\>/g, "&gt;")
                                    }</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtext;
                                }
                            }
                        }

                        if (packet.message.uploads) {
                            for (let upload of packet.message.uploads) {
                                if (upload.type.startsWith("image/") && !premyum) {
                                    msgtext += `<a target="_blank" href="${authUrl+upload.url}"><img src="${authUrl+upload.url}"></a>`;
                                    continue;
                                }
                                msgtext += `
                                    <div class="upload">
                                        <span class="material-symbols-outlined">draft</span><a class="uploadName" target="_blank" href="${authUrl+upload.url}">${upload.name}</a>
                                    </div>`;
                            }
                        }

                        fetchUser(packet.message.author).then((resp) => {
                            if (resp == null) { // this should never happen
                                unam = "Deleted User";
                                pfp = "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg";
                                if (mRef[packet.message.id] !== undefined) { // and this *definitely* shouldn't
                                    for (let meg of mRef[packet.message.id]) {
                                        let mog = document.getElementById(meg);
                                        mog.innerHTML = `<a class="invalidUser">@Deleted User</a> ${packet.message.content}`;
                                        mog.style.cursor = "pointer";
                                        mog.addEventListener("click", () => { siv(packet.message.id) });
                                    }
                                }
                            }
                            else {
                                unam = resp.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                                pfp = authUrl + resp.pfp;
                                if (mRef[packet.message.id] !== undefined) {
                                    for (let meg of mRef[packet.message.id]) {
                                        let mog = document.getElementById(meg);
                                        mog.innerHTML = `<a class="userMention" onclick="userInfo(${resp.id})">@${unam}</a>
                                            ${packet.message.content}`;
                                        mog.style.cursor = "pointer";
                                        mog.addEventListener("click", () => { siv(packet.message.id) });
                                    }
                                }
                            }
                            let message3;
                            if (packet.message.author == sers.userId && globalPermissions.includes("message.delete")) {
                                message3 = `
<div class="message3">
    <button class="material-symbols-outlined" onclick="editMessage('${packet.message.id}', '${serveur}');">Edit</button>
    <button class="material-symbols-outlined" onclick="deleteMessage('${packet.message.id}', '${serveur}');">Delete</button>
    <button class="material-symbols-outlined" onclick="replyTo('${packet.message.id}', '${serveur}');">Reply</button>
</div>`;
                            } else {
                                message3 = `
<div class="message3">
    <button class="material-symbols-outlined" onclick="ping('${packet.message.author}');">alternate_email</button>
    <button class="material-symbols-outlined" onclick="replyTo('${packet.message.id}', '${serveur}');">Reply</button>
    ${globalPermissions.includes("moderation.delete") ? `<button class="material-symbols-outlined"
    onclick="deleteMessage('${packet.message.id}', '${serveur}');">Delete</button>` : ""}
</div>`;
                            }
                            document.getElementById(`message_${packet.message.id}`).innerHTML = `
    <img src="${pfp}" class="avatar" onclick="userInfo('${packet.message.author}');"/>
    <div class="message2">
    <span><strong class="chonk" onclick="userInfo('${packet.message.author}');">${unam
        }</strong><span class="timestomp">@${resp ? resp.tag : "None"} at ${new Date(packet.message.stamp).toLocaleString()}${packet.message.edited ? ", last edited "+new Date(packet.message.edited).toLocaleString() : ""}</span></span>
        <p>${msgtext}</p>
    </div>${message3}
`;
                            if (ma.scrollHeight < ma.scrollTop  + (2 * ma.clientHeight)) {
                                if (premyum) {
                                    mainContent.innerHTML += 
                                    '<div class="message1">You\'ve got mail!</div>';
                                }
                                else ma.scrollTo(ma.scrollLeft, ma.scrollHeight - ma.clientHeight);
                            }
                            if (document.visibilityState == "hidden" && sers.userId != packet.message.author)
                                new Audio(authUrl+'/uploads/93c70e82-b447-4794-99d9-3ab070d659ea/f3cb5ab570a29417524422d17b4e4a4db33b5900df8127688ffcf352df17383f79e1cfa87d9c6ab9ce4b47e90d231d22a805597dd719fbf01fe6da6d047d7290').play();
                        });
                        break;
                    case "connected":
                        loadingScreen.className += " fadeOut";
                        if (!focusedServer) {
                            focusedServer = serveur;
                            msgtxt.focus();
                        }
                        if (!packet.manifest)
                            packet.manifest = {};
                        if (!packet.manifest.icon) {
                            packet.manifest.icon = "./icon.png";
                        }
                        if (!packet.manifest.title) {
                            packet.manifest.title = "untitled server";
                        }
                        let icomg = document.createElement("img");
                        icomg.className = "serverIcon avatar";
                        icomg.src = packet.manifest.icon;
                        icomg.addEventListener("click", () => {focusedServer=serveur;clientLoad();});
                        document.getElementById("left").appendChild(icomg);
                        if (focusedServer == serveur) {
                            document.getElementById("htitle").innerText = packet.manifest.title.toString();
                            document.getElementById("hicon").src = packet.manifest.icon;
                            peers = packet.peers;
                            globalPermissions = packet.permissions;
                            for (let peer of Object.values(peers)) {
                                let peerimg = document.createElement("img");
                                peerimg.id = `peerlabel_${peer.id}`;
                                peerimg.className = "serverIcon avatar";
                                peerimg.src = (await fetchUser(peer.id)).pfp;
                                peerimg.addEventListener("click", () => {userInfo(peer.id)});
                                if (premyum) {
                                    peerimg.style.opacity = 0.5 + Math.random() * 0.5;
                                    peerimg.style.filter = "grayscale(" + Math.random() * 100 + "%)";
                                } else if (!peer.online) {
                                    peerimg.style.opacity = 0.5;
                                    peerimg.style.filter = "grayscale";
                                }
                                document.getElementById("right").appendChild(peerimg);
                            }
                            if (packet.isAdmin) {
                                checkboxes = {};
                                document.getElementById("userInfoAdminActions").hidden = false;
                                document.getElementById("userInfoPermissionChanges").innerHTML = "";
                                for (let permission in packet.availablePermissions) {
                                    let li = document.createElement("li");
                                    let checkbox = document.createElement("input");
                                    let checkboxlabel = document.createElement("label");
                                    let label = packet.availablePermissions[permission];
                                    li.appendChild(checkbox);
                                    checkbox.type = "checkbox";
                                    checkbox.id = "permissioncheckbox_"+permission;
                                    checkboxlabel.htmlFor = "permissioncheckbox_"+permission;
                                    li.appendChild(checkboxlabel);
                                    checkboxlabel.innerText = label.charAt(0).toUpperCase() + label.slice(1);
                                    checkboxes[permission] = checkbox;
                                    document.getElementById("userInfoPermissionChanges").appendChild(li);
                                }
                            } else {
                                document.getElementById("userInfoAdminActions").hidden = true;
                            }
                        }
                        break;
                    case "banned":
                        lastMessageAuthor = null;
                        if (focusedServer !== serveur) break;
                        loadingScreen.className += " fadeOut";
                        if ("explanation" in packet)
                            mainContent.innerHTML += 
                                '<div class="message1">'+packet.explanation+'</div>';
                        else
                            mainContent.innerHTML +=
                                '<pre class="message1"><code>'+event.data+'</code></pre>';
                        break;
                    case "welcome":
                        if (focusedServer !== serveur) break;
                        if ("explanation" in packet)
                            mainContent.innerHTML += 
                                '<div class="message1">'+packet.explanation+'</div>';
                        else
                            mainContent.innerHTML +=
                                '<pre class="message1"><code>'+event.data+'</code></pre>';
                    case "join":
                        if (focusedServer !== serveur) break;
                        document.getElementById(`peerlabel_${packet.user}`).style.opacity = 1;
                        break;
                    case "disconnect":
                        if (focusedServer !== serveur) break;
                        document.getElementById(`peerlabel_${packet.user}`).style.opacity = 0.5;
                        document.getElementById(`peerlabel_${packet.user}`).style.filter = "grayscale";
                    case "connecting":
                        if (focusedServer !== serveur) break;
                        if (packet.explanation && premyum) {
                            mainContent.innerHTML += 
                                '<div class="message1">'+packet.explanation+'</div>';
                        }
                        break;
                    case "permissionChange":
                        lastMessageAuthor = null;
                        if (focusedServer !== serveur) break;
                        console.log(packet);
                        if (packet.user !== sers.userId) {
                            if (packet.value)
                                peers[packet.user].globalPermissions.push(packet.permission);
                            else
                                while (peers[packet.user].globalPermissions.includes(packet.permission))
                                    peers[packet.user].globalPermissions.splice(peers[packet.user].globalPermissions.indexOf(packet.permission), 1);
                            break;
                        } else {
                            if (packet.value) {
                                peers[packet.user].globalPermissions.push(packet.permission);
                                globalPermissions.push(packet.permission);
                            } else {
                                while (peers[packet.user].globalPermissions.includes(packet.permission))
                                    peers[packet.user].globalPermissions.splice(globalPermissions.indexOf(packet.permission), 1);
                                while (globalPermissions.includes(packet.permission))
                                    globalPermissions.splice(globalPermissions.indexOf(packet.permission), 1);
                            }
                            break;
                        }
                    default:
                        lastMessageAuthor = null;
                        if (focusedServer !== serveur) break;
                        if ("code" in packet) {
                            if (["nothingModify"].includes(packet.code) && !premyum) break;
                            if (["invisibleMsg"].includes(packet.code) && !premyum) break;
                        }
                        if ("explanation" in packet)
                            mainContent.innerHTML += 
                                '<div class="message1">'+packet.explanation+'</div>';
                        else
                            mainContent.innerHTML +=
                                '<pre class="message1"><code>'+event.data+'</code></pre>';
                        
                        if (ma.scrollHeight < ma.scrollTop  + (2 * ma.clientHeight)) {
                            if (premyum) {
                                mainContent.innerHTML += 
                                '<div class="message1">You\'ve got mail!</div>';
                            }
                            else ma.scrollTo(ma.scrollLeft, ma.scrollHeight - ma.clientHeight);
                        }
                }
            };
            }
            load();
        }
    }
    h.send();                         // well, it might be dangerous °-°
}
