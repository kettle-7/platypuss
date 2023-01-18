// °^° i am pingu
var url = new URL(window.location);
var loggedin = true;
const xhr = new XMLHttpRequest();
xhr.open('GET', '/uinfo?id='+localStorage.getItem('sid'), true);
xhr.onload = () => {
    if (xhr.status != 200) loggedin = false;
    else {
        let res = JSON.parse(xhr.responseText);
        document.getElementById("pfp").src = res.pfp;
        document.getElementById("username").innerText = "Logged in as " + res.unam;
        document.ppures = res;
    }
    if (loggedin) {
        document.getElementById("header").removeChild(document.getElementById("login"));
        document.getElementById("header").removeChild(document.getElementById("signup"));
        document.getElementById("header").removeChild(document.getElementById("spacement"));
        document.body.removeChild(document.getElementById("infopagecontainer"));
        if (url.searchParams.has("invite")) {
            let inviteCode = url.searchParams.get("invite");
            let ip = [ // the first 8 characters are the ip address in hex form
                Number("0x"+inviteCode[0]+inviteCode[1]).toString(),
                Number("0x"+inviteCode[2]+inviteCode[3]).toString(),
                Number("0x"+inviteCode[4]+inviteCode[5]).toString(),
                Number("0x"+inviteCode[6]+inviteCode[7]).toString()].join(".");
            let port = 0;
            for (let c = 8; c + 2 < inviteCode.length; c++) {
                console.log(c, port, inviteCode[c], parseInt(inviteCode[c], 16).toString(10));
                port = port * 16 + parseInt(inviteCode[c], 16);
            }
            let code = Number("0x"+inviteCode[inviteCode.length - 2]+inviteCode[inviteCode.length - 1]).toString();
            document.getElementById("serverName").innerHTML =
            document.getElementById("serverName").innerHTML.replace("ADDR", `${ip}:${port}`);
            document.getElementById("inviteparent").style.display = "flex";
            function clicky () {
                document.getElementById("invdecline").innerText = "Close";
                document.getElementById("invitepopup").removeChild(document.getElementById("acceptinvitebtn"));
                const r = new XMLHttpRequest();
                r.open("GET", `/joinserver?id=${localStorage.getItem("sid")}&ip=${ip}:${port}+${code}`);
                r.onload = () => {
                    if (r.status == 200) {
                        document.body.removeChild(document.getElementById('inviteparent'));
                        window.history.pushState({}, '', '/');
                        clientLoad();
                    } else {
                        document.getElementById("serverName").innerHTML = "Couldn't join the server, try again later?";
                    }
                }
                r.send(null);
            }
            document.getElementById("acceptinvitebtn").addEventListener("click", clicky);
        } else {
            clientLoad();
        }
    }
    else {
        document.getElementById("header").removeChild(document.getElementById("pfp"));
        document.getElementById("header").removeChild(document.getElementById("msgtxt"));
        document.getElementById("header").removeChild(document.getElementById("send"));
        document.body.removeChild(document.getElementById("actualpagecontainer"));
        if (url.searchParams.has("invite")) {
            let inviteCode = url.searchParams.get("invite");
            let ip = [ // the first 8 characters are the ip address in hex form
                Number("0x"+inviteCode[0]+inviteCode[1]).toString(),
                Number("0x"+inviteCode[2]+inviteCode[3]).toString(),
                Number("0x"+inviteCode[4]+inviteCode[5]).toString(),
                Number("0x"+inviteCode[6]+inviteCode[7]).toString()].join(".");
            let port = 0;
            for (let c = 8; c + 2 < inviteCode.length; c++) {
                port = port * 16 + parseInt(inviteCode[c], 16);
            }
            let code = Number("0x"+inviteCode[inviteCode.length - 2]+inviteCode[inviteCode.length - 1]).toString();
            let inviteHtml = `
You've been invited to join SERVER
<br>IP: ADDR
<br>COUNT members
<br>Create a free Platypuss account to join!
<br>You'll need to go to this link again afterward.
            `;
            document.getElementById("serverName").innerHTML = inviteHtml.replace("ADDR", `${ip}:${port}`);
            document.getElementById("inviteparent").style.display = "flex";
            document.getElementById("acceptinvitebtn").addEventListener("click", () => {
                window.location = "/login?ift=1";
            });
            document.getElementById("acceptinvitebtn").innerText = "Create Account";
            document.getElementById("invdecline").innerText = "Cancel";
        }
    }
};
xhr.send(null);

document.getElementById("accountInfo").addEventListener("click", (e) => {
    e.stopPropagation();
});
document.getElementById("invitepopup").addEventListener("click", (e) => {
    e.stopPropagation();
});
document.getElementById("acspopup").addEventListener("click", (e) => {
    e.stopPropagation();
});

function logout() {
    localStorage.clear();
    window.location.reload();
}

var sockets = {};

function clientLoad() {
    sockets = {};
    document.getElementById("mainContent").innerHTML = "";
    document.getElementById("sidePane").innerHTML = "";
    const h = new XMLHttpRequest();
    h.open('GET', '/sload?id='+localStorage.getItem('sid'), true);
    h.onload = () => {
        if (h.status != 200) {        // warning: this code might fail if something has gone wrong, and thus cause the 
            window.location.reload(); // page to infinitely reload. the most likely response from the user is the
        }                             // page being closed and mild confusion which is not ideal but not dangerous.
        let sers = JSON.parse(h.responseText);
        for (let serveur in sers) {
            let ip = serveur.split(' ')[0];
            let code = serveur.split(' ')[1];
            let url = ("ws://"+ip.toString());
            let ws = new WebSocket(url);
            sockets[ip] = ws;
            ws.onopen = () => {
                document.getElementById("msgtxt").addEventListener("keypress", (e) => {
                    if (e.key == "Enter") {
                        ws.send(JSON.stringify({
                            eventType: "message",
                            message: { content: document.getElementById("msgtxt").value }
                        }));
                        document.getElementById("msgtxt").value = "";
                    }
                });
                document.getElementById("send").addEventListener("click", () => {
                    ws.send(JSON.stringify({
                        eventType: "message",
                        message: { content: document.getElementById("msgtxt").value }
                    }));
                    document.getElementById("msgtxt").value = "";
                });
                ws.send(JSON.stringify({
                    eventType: "login",
                    code: code,
                    sid: localStorage.getItem("sid")
                }));
            };
            ws.onmessage = (event) => {
                let packet = JSON.parse(event.data);
                let unam, pfp;
                switch (packet.eventType) {
                    case "message":
                        const x = new XMLHttpRequest();
                        x.open('GET', '/uinfo?id='+packet.message.author, true);
                        x.onload = () => {
                            if (x.status != 200) {
                                unam = "Deleted User";
                                pfp = "";
                            }
                            else {
                                let resp = JSON.parse(x.responseText);
                                unam = resp.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                                pfp = resp.pfp;
                            }
                            document.getElementById("mainContent").innerHTML = `
<div class="message1">
    <img src="${pfp}" class="avatar"/>
    <div class="message2">
        <strong class="chonk">${unam}</strong><br>
        <p>${packet.message.content}</p>
    </div>
</div>
` + document.getElementById("mainContent").innerHTML;
                        }
                        x.send();
                        break;
                    case "messages":
                        console.log(packet.messages);
                        let q = new Array(packet.messages.length);
                        let left = packet.messages.length;
                        for (let m = 0; m < packet.messages.length; m++) {
                            const x = new XMLHttpRequest();
                            x.open('GET', '/uinfo?id='+packet.messages[m].author, true);
                            x.onload = () => {
                                left--;
                                if (x.status != 200) {
                                    unam = "Server Message";
                                    pfp = "";
                                }
                                else {
                                    let resp = JSON.parse(x.responseText);
                                    unam = resp.unam;
                                    pfp = resp.pfp;
                                }
                                q[m] = `
    <div class="message1">
        <img src="${pfp}" class="avatar"/>
        <div class="message2">
            <strong class="chonk">${unam}</strong><br>
            <p>${packet.messages[m].content}</p>
        </div>
    </div>
    `;
                                if (left < 1) {
                                    let txt = "";
                                    for (let me of q) {
                                        txt = me + txt;
                                    }
                                    document.getElementById("mainContent").innerHTML += txt;
                                }
                            }
                            x.send();
                        }
                        break;
                    case "rateLimit":
                        setTimeout(() => {
                            ws.send(JSON.stringify(packet.repeatedPacket));
                        }, packet.delay);
                        break;
                    default:
                        if ("explanation" in packet)
                            document.getElementById("mainContent").innerHTML = "<br>"+packet.explanation + document.getElementById("mainContent").innerHTML;
                        else
                            document.getElementById("mainContent").innerHTML = "<br>"+event.data + document.getElementById("mainContent").innerHTML;
                }
            };
        }
    }
    h.send();                         // well, it might be dangerous °-°
}