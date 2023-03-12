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
const cyrb53 = (str, seed = 20) => {
  let h1 = 0xdeadbeef ^ seed,
    // dead beef
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, 0) + (h1 >>> 0).toString(16).padStart(8, 0);
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
if (!authUrl) authUrl = "http://122.62.122.75";
function li() {
  ift = false;
  document.getElementById('P').style.display = 'flex';
  document.getElementById("pwdbox").hidden = true;
  document.getElementById("pwd1").addEventListener("keypress", e => {
    if (e.key == "Enter") doTheLoginThingy();
  });
  document.getElementById("lit1").innerHTML = document.getElementById("lit1").innerHTML.replace(/Create Account/g, "Sign In");
  document.getElementById("lit2").innerHTML = 'Welcome back! If you don\'t already have an account please <a href="#" onclick="su()">create an account</a> instead.';
  document.getElementById("lit3").innerText = document.getElementById("lit3").innerText.replace(/Create Account/g, "Sign In");
  return;
}
function su() {
  ift = true;
  document.getElementById('P').style.display = 'flex';
  document.getElementById("pwdbox").hidden = false;
  document.getElementById("pwd2").addEventListener("keypress", e => {
    if (e.key == "Enter") doTheLoginThingy();
  });
  document.getElementById("lit1").innerHTML = document.getElementById("lit1").innerHTML.replace(/Sign In/g, "Create Account");
  document.getElementById("lit2").innerHTML = "Welcome to Platypuss! If this is not your first time with us please <a href='#' onclick='li()'>sign in</a> instead. Please make\n\
sure to read the <a href='./tos.html'>terms of service</a> before creating an account.";
  document.getElementById("lit3").innerText = document.getElementById("lit3").innerText.replace(/Sign In/g, "Create Account");
}
function doTheLoginThingy() {
  let unam = document.getElementById("unam").value;
  let pwd1 = document.getElementById("pwd1").value;
  unam = unam.replace(/ /g, '-');
  if (ift) {
    // if you're making a new account
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
    let jsonobjectforloggingin = JSON.stringify({
      // i want long variable name
      "ift": ift,
      "ser": "122.62.122.75:3000",
      "unam": unam,
      "pwd": cyrb53(pwd1)
    });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", authUrl + '/li', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
      // Call a function when the state changes.
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
        let res = JSON.parse(xhr.responseText);
        if (ift && res.exists) {
          document.getElementById("lit2").innerHTML = 'An account with that username already exists, would you like to <a href="./login.html">log in</a> instead?';
          return;
        }
        if (!ift && !res.exists) {
          document.getElementById("lit2").innerText = "There's no account with that username, did you misspell it?";
          return;
        }
        if (!ift && !res.pwd) {
          document.getElementById("lit2").innerText = "That password isn't correct, did you misspell it?";
          return;
        }
        localStorage.setItem('sid', res.sid);
        window.location = "./index.html";
      }
    };
    xhr.send(jsonobjectforloggingin);
    return;
  }
  let jsonobjectforloggingin = JSON.stringify({
    // i want long variable name
    "ift": ift,
    "ser": "122.62.122.75:3000",
    "unam": unam,
    "pwd": cyrb53(pwd1)
  });
  const req = new XMLHttpRequest();
  req.open("POST", authUrl + '/li', true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.onreadystatechange = () => {
    // Call a function when the state changes.
    if (req.readyState === XMLHttpRequest.DONE && (req.status == 200 || req.status == 204)) {
      let res = JSON.parse(req.responseText);
      if (ift && res.exists) {
        document.getElementById("lit2").innerText = "An account with that username already exists ;-;";
        return;
      }
      if (!ift && !res.exists) {
        document.getElementById("lit2").innerText = "There's no account with that username, did you misspell it?";
        return;
      }
      if (!ift && !res.pwd) {
        document.getElementById("lit2").innerText = "That password isn't correct, did you misspell it?";
        return;
      }
      localStorage.setItem('sid', res.sid);
      window.location = "./index.html";
    }
  };
  req.send(jsonobjectforloggingin);
}
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (usercache[id] == undefined) {
      const x = new XMLHttpRequest();
      x.open('GET', authUrl + '/uinfo?id=' + id, true);
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
fetchUser(localStorage.getItem('sid')).then(res => {
  if (res == null) loggedin = false;else {
    document.getElementById("pfp").src = authUrl + res.pfp;
    document.getElementById("username").innerText = "Logged in as " + res.unam;
    document.getElementById("changePfp").src = authUrl + res.pfp;
    document.getElementById("acsusername").innerText = res.unam;
    document.getElementById("tag").innerText = res.tag;
    document.ppures = res;
  }
  if (loggedin) {
    document.getElementById("header").removeChild(document.getElementById("login"));
    document.getElementById("header").removeChild(document.getElementById("signup"));
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
            document.getElementById("fileUploadSpace").innerHTML += `<img class="avatar" id="${file.id}" src="${URL.createObjectURL(file)}"
    onclick="delete uploadQueue['${file.id}'];
        if (Object.keys(uploadQueue).length == 0) {
            document.getElementById('fileDeleteMessage').hidden = true;
        }
        this.parentElement.removeChild(this);"/>`;
          }
        }
      };
      input.click();
    });
    document.getElementById("mainContentContainer").addEventListener("drop", e => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      for (let file of files) {
        if (Object.keys(uploadQueue).every(f => uploadQueue[f].name !== file.name)) {
          file.id = Math.random().toString().replace(/[.]/g, ""); // should be good
          uploadQueue[file.id] = file;
          document.getElementById("fileDeleteMessage").hidden = false;
          // TODO: display an icon for files that aren't images
          document.getElementById("fileUploadSpace").innerHTML += `<img class="avatar" id="${file.id}" src="${URL.createObjectURL(file)}"
    onclick="delete uploadQueue['${file.id}'];
        if (Object.keys(uploadQueue).length == 0) {
            document.getElementById('fileDeleteMessage').hidden = true;
        }
        this.parentElement.removeChild(this);"/>`;
        }
      }
    });
    // document.getElementById("header").removeChild(document.getElementById("spacement"));
    const h = new XMLHttpRequest();
    h.open('GET', authUrl + '/sload?id=' + localStorage.getItem('sid'), true);
    h.onload = () => {
      if (h.status != 200) {
        // warning: this code might fail if something has gone wrong, and thus cause the 
        window.location.reload(); // page to infinitely reload. the most likely response from the user is the
      } // page being closed and mild confusion which is not ideal but not dangerous.
      let sers = JSON.parse(h.responseText);
      if (Object.keys(sers.servers).length === 0) {
        // None
        document.getElementById("everything").removeChild(document.getElementById("actualpagecontainer"));
      } else {
        document.getElementById("everything").removeChild(document.getElementById("infopagecontainer"));
      }
    };
    h.send();
    if (url.searchParams.has("invite")) {
      let inviteCode = url.searchParams.get("invite");
      let ip = [
      // the first 8 characters are the ip address in hex form
      Number("0x" + inviteCode[0] + inviteCode[1]).toString(), Number("0x" + inviteCode[2] + inviteCode[3]).toString(), Number("0x" + inviteCode[4] + inviteCode[5]).toString(), Number("0x" + inviteCode[6] + inviteCode[7]).toString()].join(".");
      let port = 0;
      for (let c = 8; c + 2 < inviteCode.length; c++) {
        port = port * 16 + parseInt(inviteCode[c], 16);
      }
      let code = Number("0x" + inviteCode[inviteCode.length - 2] + inviteCode[inviteCode.length - 1]).toString();
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
        }).catch(err => {
          document.getElementById("serverName").innerHTML = `
                    You've been invited to join a server, but we couldn't connect.<br>
                    Either the invite link is invalid or the server is currently down.
                    Please contact the server owner if you think there's an issue.
                    `;
          document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
          document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
        });
      }).catch(err => {
        document.getElementById("serverName").innerHTML = `
                You've been invited to join a server, but we couldn't connect.<br>
                Either the invite link is invalid or the server is currently down.
                Please contact the server owner if you think there's an issue.
                `;
        document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
        document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
      });
      document.getElementById("inviteparent").style.display = "flex";
      function clicky() {
        document.getElementById("invdecline").innerText = "Close";
        document.getElementById("invitepopup").removeChild(document.getElementById("acceptinvitebtn"));
        const r = new XMLHttpRequest();
        r.open("GET", authUrl + `/joinserver?id=${localStorage.getItem("sid")}&ip=${ip}:${port}+${code}`);
        r.onload = () => {
          if (r.status == 200) {
            document.body.removeChild(document.getElementById('inviteparent'));
            window.history.pushState({}, '', './index.html');
            clientLoad();
          } else {
            document.getElementById("serverName").innerHTML = "Couldn't join the server, try again later?";
          }
        };
        r.send(null);
      }
      localStorage.removeItem("pendingInvite");
      document.getElementById("acceptinvitebtn").addEventListener("click", clicky);
    } else if (localStorage.getItem("pendingInvite") != null) {
      let inviteCode = localStorage.getItem("pendingInvite");
      let ip = [
      // the first 8 characters are the ip address in hex form
      Number("0x" + inviteCode[0] + inviteCode[1]).toString(), Number("0x" + inviteCode[2] + inviteCode[3]).toString(), Number("0x" + inviteCode[4] + inviteCode[5]).toString(), Number("0x" + inviteCode[6] + inviteCode[7]).toString()].join(".");
      let port = 0;
      for (let c = 8; c + 2 < inviteCode.length; c++) {
        port = port * 16 + parseInt(inviteCode[c], 16);
      }
      let code = Number("0x" + inviteCode[inviteCode.length - 2] + inviteCode[inviteCode.length - 1]).toString();
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
        }).catch(err => {
          document.getElementById("serverName").innerHTML = `
                    You've been invited to join a server, but we couldn't connect :~(<br>
                    Either the invite link is invalid or the server is currently down.
                    Please contact the server owner if you think there's an issue.
                    `;
          document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
          document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
        });
      }).catch(err => {
        document.getElementById("serverName").innerHTML = `
                You've been invited to join a server, but we couldn't connect :~(<br>
                Either the invite link is invalid or the server is currently down.
                Please contact the server owner if you think there's an issue.
                `;
        document.getElementById("acceptinvitebtn").innerText = "Accept Anyway";
        document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
      });
      document.getElementById("inviteparent").style.display = "flex";
      localStorage.removeItem("pendingInvite");
      function clicky() {
        document.getElementById("invdecline").innerText = "Close";
        document.getElementById("invitepopup").removeChild(document.getElementById("acceptinvitebtn"));
        const r = new XMLHttpRequest();
        r.open("GET", authUrl + `/joinserver?id=${localStorage.getItem("sid")}&ip=${ip}:${port}+${code}`);
        r.onload = () => {
          if (r.status == 200) {
            document.body.removeChild(document.getElementById('inviteparent'));
            window.history.pushState({}, '', './index.html');
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
          xhr.open("POST", authUrl + '/pfpUpload?id=' + localStorage.getItem("sid") + "&ctype=" + encodeURIComponent(ctype), true);
          xhr.setRequestHeader("Content-Type", ctype);
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
              window.location.reload();
            } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 0) {
              document.getElementById("avatarTooBig").hidden = false;
            }
          };
          xhr.send(file);
        };
        input.click();
      }
      document.getElementById("changePfp").addEventListener("click", pickNewAvatar);
      document.getElementById("dodel").addEventListener("click", () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", authUrl + '/delacc?id=' + localStorage.getItem("sid"), true);
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
        xhr.open("GET", authUrl + '/passwdcfg?id=' + localStorage.getItem("sid") + "&pwd=" + cyrb53(pwd3), true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
            window.location.reload();
          } else {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              document.getElementById("nonmatch").hidden = false;
              document.getElementById("nonmatch").innerText = xhr.responseText;
            }
          }
        };
        xhr.send();
      });
    }
  } else {
    document.getElementById("header").removeChild(document.getElementById("pfp"));
    document.getElementById("everything").removeChild(document.getElementById("actualpagecontainer"));
    if (url.searchParams.has("invite")) {
      let inviteCode = url.searchParams.get("invite");
      let ip = [
      // the first 8 characters are the ip address in hex form
      Number("0x" + inviteCode[0] + inviteCode[1]).toString(), Number("0x" + inviteCode[2] + inviteCode[3]).toString(), Number("0x" + inviteCode[4] + inviteCode[5]).toString(), Number("0x" + inviteCode[6] + inviteCode[7]).toString()].join(".");
      let port = 0;
      for (let c = 8; c + 2 < inviteCode.length; c++) {
        port = port * 16 + parseInt(inviteCode[c], 16);
      }
      fetch(`http://${ip}:${port}`).then(res => {
        res.json().then(data => {
          document.getElementById("serverName").innerHTML = `
                    You've been invited to join ${data.title}
                    <br>IP: ${ip}:${port}
                    <br>${data.memberCount} members
                    <br>Create a free Platypuss account to join!
                    <br>You may need to go to this link again afterward.`;
          document.getElementById("inviteIcon").src = data.icon;
        }).catch(err => {
          document.getElementById("serverName").innerHTML = `
                    You've been invited to join a server, but we couldn't connect :~(<br>
                    Either the invite link is invalid or the server is currently down.
                    Please contact the server owner if you think there's an issue.
                    `;
          document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
        });
      }).catch(err => {
        document.getElementById("serverName").innerHTML = `
                You've been invited to join a server, but we couldn't connect :~(<br>
                Either the invite link is invalid or the server is currently down.
                Please contact the server owner if you think there's an issue.
                `;
        document.getElementById("inviteIcon").src = "https://store-images.s-microsoft.com/image/apps.53582.9007199266279243.93b9b40f-530e-4568-ac8a-9a18e33aa7ca.59f73306-bcc2-49fc-9e6c-59eed2f384f8";
      });
      document.getElementById("inviteparent").style.display = "flex";
      document.getElementById("acceptinvitebtn").addEventListener("click", () => {
        localStorage.setItem("pendingInvite", inviteCode);
        window.location = "./login.html?ift=1";
      });
      document.getElementById("acceptinvitebtn").innerText = "Create Account";
      document.getElementById("invdecline").innerText = "Cancel";
    }
  }
  document.getElementById("loadingScreen").className += " fadeOut";
});
document.getElementById("accountInfo").addEventListener("click", e => {
  e.stopPropagation();
});
document.getElementById("invitepopup").addEventListener("click", e => {
  e.stopPropagation();
});
document.getElementById("acspopup").addEventListener("click", e => {
  e.stopPropagation();
});
document.getElementById("cpwdpopup").addEventListener("click", e => {
  e.stopPropagation();
});
document.getElementById("dacpopup").addEventListener("click", e => {
  e.stopPropagation();
});
document.getElementById("p").addEventListener("click", e => {
  e.stopPropagation();
});
function logout() {
  localStorage.clear();
  window.location.reload();
}
var sockets = {};
var loadedMessages = 0;
var focusedServer;
var reply;
function deleteMessage(id, server) {
  sockets[server].send(JSON.stringify({
    eventType: "messageDelete",
    id: id
  }));
}
function googleAuth(argv) {
  console.log(argv);
}
function replyTo(id, server) {
  if (reply) {
    document.getElementById(`message_${reply}`).style.borderLeftWidth = "0px";
    document.getElementById(`message_${reply}`).style.borderLeftColor = "transparent";
  }
  reply = id;
  document.getElementById(`message_${reply}`).style.borderLeftWidth = "2px";
  document.getElementById(`message_${reply}`).style.borderLeftColor = "#0075DB";
}
function moreMessages() {
  for (let socket of Object.keys(sockets)) {
    sockets[socket].send(JSON.stringify({
      eventType: "messageLoad",
      max: 50,
      start: loadedMessages
    }));
  }
}
function siv(mid) {
  let m = document.getElementById(`message_${mid}`);
  m.scrollIntoView();
  m.className += " pulsating";
  let ma = document.getElementById("messageArea");
  if (ma.scrollTop + ma.clientHeight < ma.scrollHeight) ma.scrollTo(ma.scrollLeft, ma.scrollTop - ma.clientHeight / 2);
}

// should also work on regular files
function imageUpload(imgs, callback) {
  if (imgs.length < 1) {
    callback(null);
    return true;
  }
  const formData = new FormData();
  imgs.forEach((image, index) => {
    console.log(image, index);
    formData.append(image.name, image);
  });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", authUrl + `/upload?id=${localStorage.getItem("sid")}`);
  xhr.onreadystatechange = () => {
    document.getElementById("progress").hidden = true;
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
      callback(xhr.responseText);
    }
  };
  document.getElementById("progress").hidden = false;
  xhr.upload.onprogress = e => {
    document.getElementById("progress2").style.marginRight = `${e.loaded / e.total * 100}%`;
  };
  xhr.send(formData);
}
function clientLoad() {
  sockets = {};
  document.getElementById("loadMoreMessages").hidden = false;
  document.getElementById("mainContent").innerHTML = "";
  document.getElementById("left").innerHTML = "";
  document.getElementById("right").innerHTML = "";
  const h = new XMLHttpRequest();
  h.open('GET', authUrl + '/sload?id=' + localStorage.getItem('sid'), true);
  h.onload = () => {
    if (h.status != 200) {
      // warning: this code might fail if something has gone wrong, and thus cause the 
      window.location.reload(); // page to infinitely reload. the most likely response from the user is the
    } // page being closed and mild confusion which is not ideal but not dangerous.
    let sers = JSON.parse(h.responseText);
    focusedServer = sers[0];
    for (let serveur in sers.servers) {
      let ip = serveur.split(' ')[0];
      let code = serveur.split(' ')[1];
      let url = "ws://" + ip.toString();
      let ws = new WebSocket(url);
      ws.onopen = () => {
        sockets[ip] = ws;
        document.getElementById("msgtxt").addEventListener("keypress", e => {
          if (e.key == "Enter" /*&& focusedServer == serveur*/) {
            if (e.shiftKey) {
              if (document.getElementById("msgtxt").rows < 10) document.getElementById("msgtxt").rows += 1;
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
                  uploads.push({
                    "url": u.url,
                    "type": u.type,
                    "name": u.name
                  });
                }
              }
              ws.send(JSON.stringify({
                eventType: "message",
                message: {
                  content: document.getElementById("msgtxt").value,
                  reply: reply ? reply : undefined,
                  uploads: uploads ? uploads : undefined
                }
              }));
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
        });
        document.getElementById("send").addEventListener("click", () => {
          //                    if (focusedServer == serveur) {
          imageUpload(Object.values(uploadQueue), res => {
            let uploads = [];
            console.log(res);
            if (res) {
              if (res[0] == "E") {
                document.getElementById("progress").innerText = res;
                document.getElementById("progress").hidden = false;
                document.getElementById("progress").style.marginRight = "0px";
                return;
              }
              responseText = JSON.parse(res);
              for (let u of responseText) {
                uploads.push({
                  "url": u.url,
                  "type": u.type,
                  "name": u.name
                });
              }
            }
            ws.send(JSON.stringify({
              eventType: "message",
              message: {
                content: document.getElementById("msgtxt").value,
                reply: reply ? reply : undefined,
                uploads: uploads ? uploads : undefined
              }
            }));
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
          //                    }
        });

        ws.send(JSON.stringify({
          eventType: "login",
          code: code,
          sid: localStorage.getItem("sid")
        }));
      };
      ws.onmessage = async event => {
        let packet = JSON.parse(event.data);
        let unam, pfp;
        let ma = document.getElementById("messageArea");
        switch (packet.eventType) {
          case "message":
            loadedMessages++;
            messageMap[packet.message.id] = packet.message;
            // looks like absolute gibberish, matches uuids
            let uuidreg = /[0-9a-f]{7,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
            let msgtxt = converty.makeHtml(packet.message.content.replace(/\</g, '&lt;') /*.replace(/\>/g, '&gt;')*/).replace(/\<\/?pre\>/g);
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
              switch (t) {
                case "@":
                  let user = await fetchUser(arr[0]);
                  if (user == null) {
                    strl.splice(arr.index - 2, 39, `<a class="invalidUser">@Deleted User</a>`);
                  } else {
                    // we don't support server nicknames as they don't exist yet
                    strl.splice(arr.index - 2, 39, `
<a class="userMention" onclick="mentionClicked('${user.id}', '${packet.message.id}');">@${user.unam}</a>`);
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
                msgtxt = `<blockquote><em>Message couldn't be loaded</em></blockquote>` + msgtxt;
              } else {
                let m = await fetchUser(messageMap[packet.message.reply].author);
                if (m == null) {
                  msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply}')">
                                    <a class="invalidUser">@Deleted User</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtxt;
                } else {
                  // we don't support server nicknames as they don't exist yet
                  msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.message.reply}')">
<a class="userMention" onclick="mentionClicked('${m.id}', '${packet.message.id}');">@${m.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")}</a> ${messageMap[packet.message.reply].content}</blockquote>` + msgtxt;
                }
              }
            }
            if (packet.message.uploads) {
              for (let upload of packet.message.uploads) {
                if (upload.type.startsWith("image/")) {
                  msgtxt += `\n<br><a target="_blank" href="${authUrl + upload.url}"><img src="${authUrl + upload.url}"></a>`;
                  continue;
                }
                msgtxt += `
                                    <div class="upload">
                                        <span class="material-symbols-outlined">draft</span><a class="uploadName" target="_blank" href="${authUrl + upload.url}">${upload.name}</a>
                                    </div>`;
              }
            }
            fetchUser(packet.message.author).then(resp => {
              if (resp == null) {
                unam = "Deleted User (there's something sus about this)";
                pfp = "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg";
              } else {
                unam = resp.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                pfp = authUrl + resp.pfp;
              }
              let message3;
              if (packet.message.author == sers.userId) {
                message3 = `
<div class="message3">
    <button onclick="deleteMessage('${packet.message.id}', '${ip}');">Delete</button>
    <button onclick="replyTo('${packet.message.id}', '${ip}');">Reply</button>
</div>`;
              } else {
                message3 = `
<div class="message3">
    <button onclick="replyTo('${packet.message.id}', '${ip}');">Reply</button>
</div>`;
              }
              document.getElementById("mainContent").innerHTML += `
<div class="message1" id="message_${packet.message.id}">
    <img src="${pfp}" class="avatar"/>
    <div class="message2">
    <span><strong class="chonk">${unam}</strong>
    <span class="timestomp">#${resp ? resp.tag : "None"} at ${new Date(packet.message.stamp).toLocaleString()}</span></span>
        <p>${msgtxt}</p>
    </div>${message3}
</div>
`;
              if (ma.scrollHeight < ma.scrollTop + 2 * ma.clientHeight) {
                ma.scrollTo(ma.scrollLeft, ma.scrollHeight - ma.clientHeight);
              }
              if (document.visibilityState == "hidden" && sers.userId != packet.message.author) new Audio(authUrl + '/uploads/93c70e82-b447-4794-99d9-3ab070d659ea/f3cb5ab570a29417524422d17b4e4a4db33b5900df8127688ffcf352df17383f79e1cfa87d9c6ab9ce4b47e90d231d22a805597dd719fbf01fe6da6d047d7290').play();
            });
            break;
          case "messages":
            let txt = "";
            let scrollBottom = ma.scrollHeight - ma.scrollTop;
            for (let m = 0; m < packet.messages.length; m++) {
              messageMap[packet.messages[m].id] = packet.messages[m];
              loadedMessages++;
              if (document.getElementById(`message_${packet.messages[m].id}`)) {
                continue;
              }
              let uuidreg = /[0-9a-f]{7,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
              let msgtxt = converty.makeHtml(packet.messages[m].content.replace(/\</g, '&lt;') /*.replace(/\>/g, '&gt;')*/).replace(/\<\/?pre\>/g);
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
                switch (t) {
                  case "@":
                    let user = await fetchUser(arr[0]);
                    if (user == null) {
                      strl.splice(arr.index - 2, 39, `<a class="invalidUser">@Deleted User</a>`);
                    } else {
                      // we don't support server nicknames as they don't exist yet
                      strl.splice(arr.index - 2, 39, `
<a class="userMention" onclick="mentionClicked('${user.id}', '${packet.messages[m].id}');">@${user.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")}</a>`);
                    }
                    msgtxt = strl.join("");
                    break;
                  default:
                    break;
                }
              }
              if (packet.messages[m].reply) {
                if (!messageMap[packet.messages[m].reply]) {
                  msgtxt = `<blockquote><em>Message couldn't be loaded</em></blockquote>` + msgtxt;
                } else {
                  let ms = await fetchUser(messageMap[packet.messages[m].reply].author);
                  if (ms == null) {
                    msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.messages[m].reply}')">
                                        <a class="invalidUser">@Deleted User</a> ${messageMap[packet.messages[m].reply].content}</blockquote>` + msgtxt;
                  } else {
                    // we don't support server nicknames as they don't exist yet
                    msgtxt = `<blockquote style="cursor:pointer;" onclick="siv('${packet.messages[m].reply}')">
<a class="userMention" onclick="mentionClicked('${ms.id}', '${packet.messages[m].id}');">@${ms.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")}</a> ${messageMap[packet.messages[m].reply].content}</blockquote>` + msgtxt;
                  }
                }
              }
              if (packet.messages[m].uploads) {
                for (let upload of packet.messages[m].uploads) {
                  if (upload.type.startsWith("image/")) {
                    msgtxt += `\n<br><a target="_blank" href="${authUrl + upload.url}"><img src="${authUrl + upload.url}"></a>`;
                    continue;
                  }
                  msgtxt += `
                                        <div class="upload">
                                            <span class="material-symbols-outlined">draft</span><a class="uploadName" target="_blank" href="${authUrl + upload.url}">${upload.name}</a>
                                        </div>`;
                }
              }
              let user = await fetchUser(packet.messages[m].author);
              if (user == null) {
                unam = "Deleted User";
                pfp = "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg";
              } else {
                unam = user.unam.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                pfp = authUrl + user.pfp;
              }
              let message3;
              if (packet.messages[m].author == sers.userId) {
                message3 = `
<div class="message3">
    <button onclick="deleteMessage('${packet.messages[m].id}', '${ip}');">Delete</button>
    <button onclick="replyTo('${packet.messages[m].id}', '${ip}');">Reply</button>
</div>`;
              } else {
                message3 = `
<div class="message3">
    <button onclick="replyTo('${packet.messages[m].id}', '${ip}');">Reply</button>
</div>`;
              }
              txt += `
<div class="message1" id="message_${packet.messages[m].id}">
    <img src="${pfp}" class="avatar"/>
    <div class="message2">
        <span><strong class="chonk">${unam}</strong>
        <span class="timestomp">#${user ? user.tag : "None"} at ${new Date(packet.messages[m].stamp).toLocaleString()}</span></span>
        <p>${msgtxt}</p>
    </div>${message3}
</div>
`;
              if (m + 1 == packet.messages.length) {
                // is this the last message
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
          case "connected":
          case "join":
          case "connecting":
          case "disconnect":
            break;
          default:
            if ("code" in packet) {
              if (["nothingModify"].includes(packet.code)) break;
            }
            if ("explanation" in packet) document.getElementById("mainContent").innerHTML += '<div class="message1">' + packet.explanation + '</div>';else document.getElementById("mainContent").innerHTML += '<pre class="message1"><code>' + event.data + '</code></pre>';
            if (ma.scrollHeight < ma.scrollTop + 2 * ma.clientHeight) {
              ma.scrollTo(ma.scrollLeft, ma.scrollHeight - ma.clientHeight);
            }
        }
      };
    }
  };
  h.send(); // well, it might be dangerous °-°
}