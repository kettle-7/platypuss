 /************************************************************************
 * Copyright 2020-2023 Ben Keppel, Marley Carroll                        *
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
if (!authUrl) authUrl = "http://platypuss.ddns.net";

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
    if (res == null || localStorage.getItem('sid') == null) {
        if (!url.searchParams.has("invite") && !localStorage.getItem("pendingInvite"))
        window.location = "./index.html";
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
                document.getElementById("acceptinvitebtn").focus();
            };
            input.click();
        });
        document.getElementById("mainContentContainer").addEventListener("drop", (e) => {
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
            document.getElementById("msgtxt").focus();
        });
        // document.getElementById("header").removeChild(document.getElementById("spacement"));
        const h = new XMLHttpRequest();
        h.open('GET', authUrl+'/sload?id='+localStorage.getItem('sid'), true);
        h.onload = () => {
            if (h.status != 200) {
                localStorage.clear();
                if (url.searchParams.has("invite")) localStorage.setItem("pendingInvite", url.searchParams.get("invite"));
                if (url.searchParams.has("invip")) localStorage.setItem("pendingInvip", url.searchParams.get("invip"));
                window.location = "/index.html";
            }
            let sers = JSON.parse(h.responseText);
            if (Object.keys(sers.servers).length === 0 && !url.searchParams.has("invite") && !localStorage.getItem("pendingInvite")) { // None
                window.location = "./index.html";
            }
        };
        h.send();
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
            fetch(`http://${ip}:${port}`).then(res => {
                res.json().then(data => {
                    document.getElementById("serinvitetitle").innerText = data.title.toString();
                    document.getElementById("serverName").innerHTML = `
                    You've been invited to join ${data.title}
                    <br>IP: ${ip}:${port}
                    <br>${data.memberCount} members
                    <p>${converty.makeHtml(data.description.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;"))}</p>
                    `;
                    document.getElementById("inviteIcon").src = data.icon;
                    document.getElementById("loadingScreen").className += " fadeOut";
                    document.getElementById("acceptinvitebtn").focus();
                }).catch(err => {
                    console.error(err);
                    document.getElementById("serverName").innerHTML = `
                    You've been invited to join a server, but we couldn't connect.<br>
                    Either the invite link is invalid or the server is currently down.
                    Please contact the server owner if you think there's an issue.
                    `;
                    document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
                    document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
                    document.getElementById("loadingScreen").className += " fadeOut";
                    document.getElementById("invdecline").focus();
                });
            }).catch(err => {
                console.error(err);
                document.getElementById("serverName").innerHTML = `
                You've been invited to join a server, but we couldn't connect.<br>
                Either the invite link is invalid or the server is currently down.
                Please contact the server owner if you think there's an issue.
                `;
                document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
                document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
                document.getElementById("loadingScreen").className += " fadeOut";
                document.getElementById("invdecline").focus();
            });
            document.getElementById("inviteparent").style.display = "flex";
            function clicky () {
                document.getElementById("invdecline").innerText = "Close";
                document.getElementById("invitepopup").removeChild(document.getElementById("acceptinvitebtn"));
                const r = new XMLHttpRequest();
                r.open("GET", authUrl+`/joinserver?id=${localStorage.getItem("sid")}&ip=${ip}:${port}+${code}${"+"+ogip}`);
                r.onload = () => {
                    if (r.status == 200) {
                        document.body.removeChild(document.getElementById('inviteparent'));
                        window.history.pushState({}, '', './chat.html');
                        clientLoad();
                    } else {
                        document.getElementById("serverName").innerHTML = "Couldn't join the server, try again later?";
                    }
                }
                r.send(null);
            }
            localStorage.removeItem("pendingInvite");
            localStorage.removeItem("pendingInvip");
            document.getElementById("acceptinvitebtn").addEventListener("click", clicky);
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
            fetch(`http://${ip}:${port}`).then(res => {
                res.json().then(data => {
                    document.getElementById("serinvitetitle").innerText = data.title.toString();
                    document.getElementById("serverName").innerHTML = `
                    You've been invited to join ${data.title}
                    <br>IP: ${ip}:${port}
                    <br>${data.memberCount} members
                    <p>${converty.makeHtml(data.description.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;"))}</p>
                    `;
                    document.getElementById("inviteIcon").src = data.icon;
                    document.getElementById("loadingScreen").className += " fadeOut";
                    document.getElementById("acceptinvitebtn").focus();
                }).catch(err => {
                    console.error(err);
                    document.getElementById("serverName").innerHTML = `
                    You've been invited to join a server, but we couldn't connect :~(<br>
                    Either the invite link is invalid or the server is currently down.
                    Please contact the server owner if you think there's an issue.
                    `;
                    document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
                    document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
                    document.getElementById("loadingScreen").className += " fadeOut";
                    document.getElementById("invdecline").focus();
                });
            }).catch(err => {
                console.error(err);
                document.getElementById("serverName").innerHTML = `
                You've been invited to join a server, but we couldn't connect :~(<br>
                Either the invite link is invalid or the server is currently down.
                Please contact the server owner if you think there's an issue.
                `;
                document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
                document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
                document.getElementById("loadingScreen").className += " fadeOut";
                document.getElementById("invdecline").focus();
            });
            document.getElementById("inviteparent").style.display = "flex";
            localStorage.removeItem("pendingInvite");
            localStorage.removeItem("pendingInvip");
            function clicky () {
                document.getElementById("invdecline").innerText = "Close";
                document.getElementById("invitepopup").removeChild(document.getElementById("acceptinvitebtn"));
                const r = new XMLHttpRequest();
                r.open("GET", authUrl+`/joinserver?id=${localStorage.getItem("sid")}&ip=${ip}:${port}+${code}${"+"+ogip}`);
                r.onload = () => {
                    if (r.status == 200) {
                        document.body.removeChild(document.getElementById('inviteparent'));
                        window.history.pushState({}, '', './chat.html');
                        clientLoad();
                    } else {
                        document.getElementById("serverName").innerHTML = "Couldn't join the server, maybe try again later?";
                    }
                };
                r.send(null);
            }
            document.getElementById("acceptinvitebtn").addEventListener("click", clicky);
        } else {
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
        if (!url.searchParams.has("invite") && !localStorage.getItem("pendingInvite"))
        window.location = "./index.html";
    }
}, () => {
    if (url.host.startsWith("http://192.168") && !localStorage.getItem("forceAuth")) {
        localStorage.setItem("authUrl", "http://192.168.1.69:3000");
        window.location.reload();
    }
    if (!url.searchParams.has("invite") && !localStorage.getItem("pendingInvite"))
    window.location = "./index.html";
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

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        au();
        for (let e of [
            "accountInfoParent",
            "P",
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

if (authUrl != url.protocol + "//" + url.host && url.protocol == "http:" && !localStorage.getItem("forceAuth")) {
    localStorage.setItem("authUrl", url.protocol + "//" + url.host);
    window.location.reload();
}

function logout() {
    localStorage.clear();
    window.location = "./index.html";
}

var sockets = {};
var loadedMessages = 0;
var focusedServer;
var reply;

function deleteMessage(id, server) {
    if (premyum) return;
    sockets[server].send(JSON.stringify({
        eventType: "messageDelete",
        id: id
    }));
    document.getElementById("msgtxt").focus();
}

function editMessage(id, server) {
    if (premyum) return;
    edit = id;
    document.getElementById("msgtxt").value = messageMap[id].content;
    document.getElementById("msgtxt").focus();
}

function googleAuth(argv) {
    console.log(argv);
}

function replyTo(id, server) {
    if (premyum) return;
    if (reply) {
        document.getElementById(`message_${reply}`).style.borderLeftWidth = "0px";
        document.getElementById(`message_${reply}`).style.borderLeftColor = "transparent";
    }
    reply = id;
    document.getElementById(`message_${reply}`).style.borderLeftWidth = "2px";
    document.getElementById(`message_${reply}`).style.borderLeftColor = "#0075DB";
    document.getElementById("msgtxt").focus();
}

function userInfo(id) {
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
    });
}

function ping(id) {
    if (premyum) return;
    document.getElementById("msgtxt").value += ` [@${id}] `;
    document.getElementById("msgtxt").focus();
}

function moreMessages() {
    sockets[focusedServer].send(JSON.stringify({
        eventType: "messageLoad",
        max: 100,
        start: loadedMessages
    }));
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
    if (imgs.length < 1 || premyum) {
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
        document.getElementById("progress").hidden = true;
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
            callback(xhr.responseText);
            document.getElementById("acceptinvitebtn").focus();
        }
    };
    document.getElementById("progress").hidden = false;
    xhr.upload.onprogress = (e) => {
        document.getElementById("progress2").style.marginRight = `${100-(e.loaded/e.total*100)}%`
    };
    xhr.send(formData);
}

function ke(e) {
    let ws = sockets[focusedServer];
    if (e.key == "Enter") {
        if (e.shiftKey) {
            if (document.getElementById("msgtxt").rows < 10)
                document.getElementById("msgtxt").rows += 1;
            return;
        }
        document.getElementById("progress").innerHTML = '<div id="progress2"></div>';
        imageUpload(Object.values(uploadQueue), res => {
            let uploads = [];
            if (res) {
                if (res[0] == "E") {
                    document.getElementById("progress").innerText = res;
                    document.getElementById("progress").hidden = false;
                    document.getElementById("progress").style.marginRight = "0px";
                    return;
                }
                responseText = JSON.parse(res);
                for (let u of responseText) {
                    uploads.push({"url": u.url, "type": u.type, "name": u.name});
                }
            }
            console.log(edit);
            if (edit == false) {
                ws.send(JSON.stringify({
                    eventType: "message",
                    message: { content: document.getElementById("msgtxt").value, reply: reply ? reply : undefined, uploads: uploads ? uploads : undefined }
                }));
            } else {
                ws.send(JSON.stringify({
                    eventType: "messageEdit",
                    id: edit,
                    message: { content: document.getElementById("msgtxt").value }
                }));
                edit = false;
            }
            document.getElementById("msgtxt").value = "";
            document.getElementById("msgtxt").rows = 2;
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
                document.getElementById("progress").innerText = res;
                document.getElementById("progress").hidden = false;
                document.getElementById("progress").style.marginRight = "0px";
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
                message: { content: document.getElementById("msgtxt").value, reply: reply ? reply : undefined, uploads: uploads ? uploads : undefined }
            }));
        else {
            ws.send(JSON.stringify({
                eventType: "messageEdit",
                id: edit,
                message: { content: document.getElementById("msgtxt").value }
            }));
            edit = false;
        }
        document.getElementById("msgtxt").value = "";
        document.getElementById("msgtxt").rows = 2;
        if (reply) {
            document.getElementById(`message_${reply}`).style.borderLeftWidth = "0px";
            document.getElementById(`message_${reply}`).style.borderLeftColor = "transparent";
        }
        reply = false;
        uploadQueue = {};
        document.getElementById("fileUploadSpace").innerHTML = "";
        document.getElementById("fileDeleteMessage").hidden = true;
        document.getElementById("msgtxt").focus();
    });
}

document.getElementById("msgtxt").addEventListener("paste", function (e) {
    console.log(e.clipboardData.getData("url"), e.clipboardData.files);
    
    document.getElementById("mainContentContainer").addEventListener("drop", (e) => {
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
        document.getElementById("msgtxt").focus();
    });
});

document.getElementById("msgtxt").addEventListener("keypress", ke);
document.getElementById("send").addEventListener("click", ce);
var elapsed;
breaks = [];

function clientLoad() {
    for (let socket of Object.values(sockets)) {
        socket.close();
    }
    for (let bread of breaks) {
        clearTimeout(bread);
    }
    elapsed = false;
    sockets = {};
    let opensocks = 0;
    let ips = [];
    document.getElementById("loadMoreMessages").hidden = false;
    document.getElementById("mainContent").innerHTML = "";
    document.getElementById("left").innerHTML = "";
    document.getElementById("right").innerHTML = "";
    let ma = document.getElementById("messageArea");
    const h = new XMLHttpRequest();
    h.open('GET', authUrl+'/sload?id='+localStorage.getItem('sid'), true);
    h.onload = () => {
        if (h.status != 200) {        // warning: this code might fail if something has gone wrong, and thus cause the 
            localStorage.clear();     // page to infinitely reload. the most likely response from the user is the
            window.location = "/";    // page being closed and mild confusion which is not ideal but not dangerous.
        }

        setTimeout(() => {
            if (opensocks < 1) {
                document.getElementById("loadingScreen").className += " fadeOut";
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
            let url = ("ws://"+ip.toString());
            let ws = new WebSocket(url);
            document.getElementById("left").innerHTML = "";
            breaks.push(setTimeout(() => {
                if (ws.readyState == 0) {
                    ws.close();
                }
                elapsed = true;
            }, 60000));
            ws.onerror = () => {
                console.error(`Warning: couldn't connect to ${ip}, try check your internet connection or inform the owner(s) of the server.`);
                console.log(elapsed);
                if (elapsed) clientLoad();
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
            /*
            ws.onclose = () => {
                console.error(`Warning: the server at ${ip} closed.`);
                if (elapsed) clientLoad();
            };*/
            ws.onmessage = async (event) => {
                let packet = JSON.parse(event.data);
                let unam, pfp;
                switch (packet.eventType) {
                    case "message":
                        if (focusedServer == serveur) {
                            loadedMessages++;
                            messageMap[packet.message.id] = packet.message;
                            // looks like absolute gibberish, matches uuids
                            let uuidreg = /[0-9a-f]{7,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
                            let msgtxt = converty.makeHtml(packet.message.content.replace(/\</g, '&lt;')/*.replace(/\>/g, '&gt;')*/);
                            let arr;
                            while ((arr = uuidreg.exec(msgtxt)) !== null) {
                                let strl = msgtxt.split("");
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
                                        msgtxt = strl.join("");
                                        //uuidreg.exec(msgtxt);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if (packet.message.reply) {
                                if (!messageMap[packet.message.reply]) {
                                    msgtxt = `<blockquote id="r_${packet.message.id}"><em>Message couldn't be loaded</em></blockquote>` + msgtxt;
                                    if (mRef[packet.message.reply] == undefined) {
                                        mRef[packet.message.reply] = [`r_${packet.message.id}`];
                                    } else {
                                        mRef[packet.message.reply].push(`r_${packet.message.id}`);
                                    }
                                } else {
                                    let m = await fetchUser(messageMap[packet.message.reply].author);
                                    if (m == null) {
                                        msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply
                                            }')"><a class="invalidUser">@Deleted User</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtxt;
                                    } else {
                                        // we don't support server nicknames as they don't exist yet
                                        msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply}')">
<a class="userMention" onclick="userInfo('${m.id}');">@${m.unam
                                            .replace(/\</g, "&lt;")
                                            .replace(/\>/g, "&gt;")
                                        }</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtxt;
                                    }
                                }
                            }

                            if (packet.message.uploads) {
                                for (let upload of packet.message.uploads) {
                                    if (upload.type.startsWith("image/") && !premyum) {
                                        msgtxt += `\n<br><a target="_blank" href="${authUrl+upload.url}"><img src="${authUrl+upload.url}"></a>`;
                                        continue;
                                    }
                                    msgtxt += `
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
                                if (packet.message.author == sers.userId) {
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
</div>`;
                                }
                                document.getElementById("mainContent").innerHTML += `
<div class="message1" id="message_${packet.message.id}">
    <img src="${pfp}" class="avatar" onclick="userInfo('${packet.message.author}');"/>
    <div class="message2">
    <span><strong class="chonk" onclick="userInfo('${packet.message.author}');">${unam
        }</strong><span class="timestomp">@${resp ? resp.tag : "None"} at ${new Date(packet.message.stamp).toLocaleString()}</span></span>
        <p>${msgtxt}</p>
    </div>${message3}
</div>
`;
                                if (ma.scrollHeight < ma.scrollTop  + (2 * ma.clientHeight)) {
                                    ma.scrollTo(ma.scrollLeft, ma.scrollHeight - ma.clientHeight);
                                }
                                if (document.visibilityState == "hidden" && sers.userId != packet.message.author)
                                    new Audio(authUrl+'/uploads/93c70e82-b447-4794-99d9-3ab070d659ea/f3cb5ab570a29417524422d17b4e4a4db33b5900df8127688ffcf352df17383f79e1cfa87d9c6ab9ce4b47e90d231d22a805597dd719fbf01fe6da6d047d7290').play();
                            });
                        }
                        break;
                    case "messages":
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
                            let msgtxt = converty.makeHtml(packet.messages[m].content.replace(/\</g, '&lt;')/*.replace(/\>/g, '&gt;')*/);
                            let arr;
                            while ((arr = uuidreg.exec(msgtxt)) !== null) {
                                let strl = msgtxt.split("");
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
                                        msgtxt = strl.join("");
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if (packet.messages[m].reply) {
                                if (!messageMap[packet.messages[m].reply]) {
                                    msgtxt = `<blockquote id="r_${packet.messages[m].id}"><em>Message couldn't be loaded</em></blockquote>` + msgtxt;
                                    if (mRef[packet.messages[m].reply] == undefined) {
                                        mRef[packet.messages[m].reply] = [`r_${packet.messages[m].id}`];
                                    } else {
                                        mRef[packet.messages[m].reply].push(`r_${packet.messages[m].id}`);
                                    }
                                } else {
                                    let ms = await fetchUser(messageMap[packet.messages[m].reply].author);
                                    if (ms == null) {
                                        msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.messages[m].reply
                                            }')"><a class="invalidUser">@Deleted User</a> ${messageMap[packet.messages[m].reply].content}</blockquote>` + msgtxt;
                                    } else {
                                        // we don't support server nicknames as they don't exist yet
                                        msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.messages[m].reply}')">
<a class="userMention" onclick="userInfo('${ms.id}');">@${ms.unam
                                            .replace(/\</g, "&lt;")
                                            .replace(/\>/g, "&gt;")
                                        }</a> ${messageMap[packet.messages[m].reply].content}</blockquote>` + msgtxt;
                                    }
                                }
                            }

                            if (packet.messages[m].uploads) {
                                for (let upload of packet.messages[m].uploads) {
                                    if (upload.type.startsWith("image/") && !premyum) {
                                        msgtxt += `\n<br><a target="_blank" href="${authUrl+upload.url}"><img src="${authUrl+upload.url}"></a>`;
                                        continue;
                                    }
                                    msgtxt += `
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
    <button class="material-symbols-outlined" onclick="editMessage('${packet.messages[m].id}', '${serveur}');">Edit</button>
    <button class="material-symbols-outlined" onclick="deleteMessage('${packet.messages[m].id}', '${serveur}');">Delete</button>
    <button class="material-symbols-outlined" onclick="replyTo('${packet.messages[m].id}', '${serveur}');">Reply</button>
</div>`;
                            } else {
                                message3 = `
<div class="message3">
    <button class="material-symbols-outlined" onclick="ping('${packet.messages[m].author}');">alternate_email</button>
    <button class="material-symbols-outlined" onclick="replyTo('${packet.messages[m].id}', '${serveur}');">Reply</button>
</div>`;
                            }
                            txt += `
<div class="message1" id="message_${packet.messages[m].id}">
    <img src="${pfp}" class="avatar" onclick="userInfo('${packet.messages[m].author}');"/>
    <div class="message2">
        <span><strong class="chonk" onclick="userInfo('${packet.messages[m].author}');">${unam
        }</strong><span class="timestomp">@${user ? user.tag : "None"} at ${new Date(packet.messages[m].stamp).toLocaleString()}</span></span>
        <p>${msgtxt}</p>
    </div>${message3}
</div>
`;
                            if (m + 1 == packet.messages.length) { // is this the last message
                                document.getElementById("mainContent").innerHTML = txt + document.getElementById("mainContent").innerHTML;
                                ma.scrollTo(ma.scrollLeft, ma.scrollHeight - scrollBottom);
                            }
                        }

                        if (packet.isTop) {
                            document.getElementById("mainContent").innerHTML = `
<span class="message1" style="text-align: center; align-self: stretch;">
    You've reached the top! Well done.
</span>
` + document.getElementById("mainContent").innerHTML;
                            document.getElementById("loadMoreMessages").hidden = true;
                        }
                        break;
                    case "rateLimit":
                        setTimeout(() => {
                            ws.send(JSON.stringify(packet.repeatedPacket));
                        }, packet.delay);
                        break;
                    case "messageDeleted":
                        document.getElementById(`message_${packet.messageId}`).style.display = "none";
                        break;
                    case "messageEdited":
                        console.log(`message_${packet.message.id}`);
                        document.getElementById(`message_${packet.message.id}`).innerText = "✨ undefined behaviour ✨";
                        break;
                    case "connected":
                        document.getElementById("loadingScreen").className += " fadeOut";
                        if (!focusedServer) {
                            focusedServer = serveur;
                            document.getElementById("msgtxt").focus();
                        }
                        if (!packet.manifest)
                            packet.manifest = {};
                        if (!packet.manifest.icon) {
                            packet.manifest.icon = "./icon.png";
                        }
                        let icomg = document.createElement("img");
                        icomg.className = "serverIcon avatar";
                        icomg.src = packet.manifest.icon;
                        icomg.addEventListener("click", () => {focusedServer=serveur;clientLoad();});
                        document.getElementById("left").appendChild(icomg);
                        break;
                    case "join":
                    case "connecting":
                    case "disconnect":
                        if (packet.explanation && premyum) {
                            document.getElementById("mainContent").innerHTML += 
                                '<div class="message1">'+packet.explanation+'</div>';
                        }
                        break;
                    default:
                        if ("code" in packet) {
                            if (["nothingModify"].includes(packet.code) && !premyum) break;
                            if (["invisibleMsg"].includes(packet.code) && !premyum) break;
                        }
                        if ("explanation" in packet)
                            document.getElementById("mainContent").innerHTML += 
                                '<div class="message1">'+packet.explanation+'</div>';
                        else
                            document.getElementById("mainContent").innerHTML +=
                                '<pre class="message1"><code>'+event.data+'</code></pre>';
                        
                        if (ma.scrollHeight < ma.scrollTop  + (2 * ma.clientHeight)) {
                            ma.scrollTo(ma.scrollLeft, ma.scrollHeight - ma.clientHeight);
                        }
                }
            };
            }
            load();
        }
    }
    h.send();                         // well, it might be dangerous °-°
}
