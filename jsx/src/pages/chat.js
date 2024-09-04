/************************************************************************
* Copyright 2021-2024 Ben Keppel                                        *
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

import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import * as React from "react";
import "./themery.scss";

var userCache = {}; // A cache of data on users so we don't constantly have to look it up
var messageCache = {}; // The same but for messages, we might not need this
var permissions = {}; // The permissions we have, key being an identifier and value being a friendly description
var states = {populated:false}; // One global variable for storing React state objects so we can access them anywhere
var openSockets = {}; // Keeps track of open websockets
var peers = {}; // Keeps track of other people on the server (platonically of course :3)
var loadedMessages = 0; // The number of messages loaded in the current view, used when loading older messages
var serverHashes = {}; // We can use these to get links to specific servers / maybe rooms in the future
var browser = typeof window !== "undefined"; // check if we're running in a browser rather than the build environment
var emailRef, passwordRef, confirmPasswordRef, usernameRef;
var finishedLoading = false;
var roomCache = {};

var pageUrl = browser ? new URL(window.location) : new URL("http://localhost:8000"); // window is not defined in the testing environment so just assume localhost
var authUrl = "https://platypuss.net"; // Authentication server, you shouldn't have to change this but it's a variable just in case
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
pageUrl.protocol = "https"; // remove this in production

const markdownOptions = {
  disableParsingRawHTML: true, // poses a security thread we don't need
  overrides: {
    code: SyntaxHighlightedCode
  }
};

// thanks bryc on stack overflow ^w^
function hashPassword (str, seed = 20) { // hashes things somehow
    let h1 = 0xdeadbeef ^ seed, // had to be something
    h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        // Math.imul multiplies without loss of precision
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return (h2>>>0).toString(16).padStart(8,0)+(h1>>>0).toString(16).padStart(8,0);
};

// Fetch data on one user, from cache if possible but from the authentication server otherwise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (userCache[id] == undefined) {
      // try fetch data from the authentication server
      fetch(authUrl+'/uinfo?id='+id).then(response => {
        // try turn the json response into an object
        response.json().then(responseObject => {
          userCache[id] = responseObject;
          resolve(responseObject);
        }).catch(()=>reject()); // if it's not valid json then reject the promise
      }).catch(()=>reject()); // same for if we can't connect to the server for some reason
    } else {
      resolve(userCache[id]); // we already know about the user so don't look them up
    }
  });
}

function doTheLoginThingy(createNewAccount) {
  if (createNewAccount) {
    if (passwordRef.current.value != confirmPasswordRef.current.value) {
      states.setActivePopover(<CreateAccountPopover error="Your passwords don't match"/>);
      return;
    }
    if (passwordRef.current.value.replace(/[\n\r\t ]/g, "") == "") {
      states.setActivePopover(<CreateAccountPopover error="Your password must be at least one character"/>);
      return;
    }
    if (usernameRef.current.value.replace(/[\n\r\t ]/g, "") == "") {
      states.setActivePopover(<CreateAccountPopover error="Your username must be at least one character"/>);
      return;
    }
  }
  fetch(`${authUrl}/login`, { // send this data to the authentication server, accepting a json response
    method: "POST",
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify({ // the information we send to the authentication server
      createNew: createNewAccount,
      server: "example.com", // can be anything so long as no platypuss server will actually be hosted there,
      email: emailRef.current.value,
      username: createNewAccount ? usernameRef.current.value : undefined,
      password: hashPassword(passwordRef.current.value)
    })
    // we take the response and save the session token to the browser
  }).then(response => response.json()).then(response => {
    if (createNewAccount) {
      if (response.alreadyExists) {
        states.setActivePopover(<CreateAccountPopover error={<>There's already an account with that email address,
          would you like to <a href="#" onClick={() => states.setActivePopover(<SignInPopover/>)}>sign in</a> instead?</>}/>);
        return;
      }
      states.setActivePopover(<Popover title="Check your emails!">Thanks for joining us, 
        you should get <br/> an email in the next few minutes to <br/> confirm the new account.</Popover>);
      return;
    } else {
      if (!response.alreadyExists) {
        states.setActivePopover(<SignInPopover error={<>There's no account with that email address,
          would you like to <a href="#" onClick={() => states.setActivePopover(<CreateAccountPopover/>)}>create one</a>?</>}/>);
        return;
      }
      if (!response.passwordMatches) {
        states.setActivePopover(<SignInPopover error="Incorrect password for this account"/>);
        return;
      }
    }
    localStorage.setItem("sessionID", response.sessionID);
    window.location.reload();
  });
}

function SignInPopover ({ error="" }) {
  return (<Popover title="Sign In">
    <span>Welcome back! If you don't already have an account <br/> please <a href="#" onClick={() => states.setActivePopover(<CreateAccountPopover/>)}>create an account</a> instead.</span>
    <div id="loginform">
      <em id="signInErrorMessage">{error}</em>
      <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
      <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
      <label>Password </label><input type="password" id="password" className="textBox" ref={passwordRef}/>
      </div><br/>
      <button onClick={() => doTheLoginThingy(false)}>Sign In</button>
    </div>
  </Popover>);
}

function CreateAccountPopover ({ error="" }) {
  [emailRef, usernameRef, passwordRef, confirmPasswordRef] = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null)
  ];
  return (<Popover title="Create Account">
    <span>Welcome to Platypuss! If you already have an account <br/> please <a href="#" onClick={() => states.setActivePopover(<SignInPopover/>)}>sign in</a> instead.</span>
    <div id="loginform">
      {error ? <em id="signInErrorMessage">{error}</em> : ""}
      <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
      <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
      <label>Username </label><input type="text" id="unam" className="textBox" ref={usernameRef}/>
      <label>Password </label><input type="password" id="password" className="textBox" ref={passwordRef}/>
      <label>Confirm Password </label><input type="password" id="confirmPassword" className="textBox" ref={confirmPasswordRef}/>
      </div><br/>
      <button onClick={() => doTheLoginThingy(true)}>Create Account</button>
    </div>
  </Popover>);
}

function SyntaxHighlightedCode(props) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes('lang-') && hljs) {
      hljs.highlightElement(ref.current)

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute('data-highlighted')
    }
  }, [props.className, props.children])

  return <code {...props} ref={ref} />
}

function PopoverParent({...props}) {
  [states.activePopover, states.setActivePopover] = React.useState(null);
  return (
    <div id="popoverParent" style={{display: states.activePopover == null ? "none" : "flex"}} onClick={() => {
      states.setActivePopover(null);
    }} {...props}>{states.activePopover}</div>
  );
}

// for popups / popovers in desktop, render as separate screens on mobile
function Popover({children, title, style={}, ...props}) {
  return <div id="popover" style={{margin: style.margin ? style.margin : "auto", ...style}} onClick={event => {
    event.stopPropagation();
  }} {...props}>
    <div id="popoverHeaderBar">
      <h3>{title}</h3>
      <div style={{flexGrow: 1}}></div>
      <button onClick={() => {states.setActivePopover(null);}} className="material-symbols-outlined">close</button>
    </div>
    {children}
  </div>
}

// The midsection between these two aforementioned bars
function MiddleSection({shown, className, ...props}) {
  const belowMessagesRef = React.useRef(null);
  const scrolledAreaRef = React.useRef(null);
  React.useEffect(() => {
    let scrolledArea = scrolledAreaRef.current;
    if ( // only scroll down if we're near the bottom or the page has just loaded
        (scrolledArea.scrollHeight < scrolledArea.scrollTop  + (2 * scrolledArea.clientHeight)) ||
        !finishedLoading
    ) {
      belowMessagesRef.current?.scrollIntoView({ behaviour: "smooth" });
    }
  }, [states.focusedRoomRenderedMessages]);
  return (<div id="middleSection" className={className} style={{display: shown ? "flex" : "none"}} {...props}>
    <div id="aboveScrolledArea"></div>
    <div id="scrolledArea" ref={scrolledAreaRef}> {/* Has a scrollbar, contains load more messages button but not message typing box */}
      <div id="aboveMessageArea">
        <button id="loadMoreMessagesButton" onClick={loadMoreMessages}>Load more messages</button>
      </div>
      <div id="messageArea">{states.focusedRoomRenderedMessages.map(message => <Message message={message} key={message.id}/>)}</div>
      <div id="belowMessageArea" ref={belowMessagesRef}></div>
    </div>
    <div style={{height:5,background:"linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3))"}}></div>
    <div id="belowScrolledArea">
      <div contentEditable id="messageBox" onKeyDown={event=>{
        if (event.key == "Enter" && !states.useMobileUI && !event.shiftKey) {
          triggerMessageSend();
          event.preventDefault();
        }
      }}></div>
      <button className="material-symbols-outlined">publish</button>
      <button className="material-symbols-outlined" onClick={triggerMessageSend}>send</button>
    </div>
  </div>);
}

// Renders a single message
function Message({message}) {
  // We might have the author cached already, if not we'll just get them later
  let [author, setAuthor] = React.useState(userCache[message.author] || {
    avatar: "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg",
    username: "Deleted User"
  });
  let sentByThisUser = message.author == states.accountInformation.id;
  let uploads = message.uploads ? message.uploads : [];
  fetchUser(message.author).then(newAuthor=>{setAuthor(newAuthor)});
  return (<div className="message1">
    <img src={author.avatar} alt="🐙" className="avatar" style={{
      height: message.special ? "0px" : undefined
    }}/>
    <div className="message2">
      <div className="messageAuthor" hidden={message.special}>
        <h3 className="messageUsernameDisplay">{author.username}</h3>
        <span className="messageTimestamp">@{author.tag} at {message.timestamp ? new Date(message.timestamp).toLocaleString() : new Date(message.stamp).toLocaleString()}</span>
      </div>
      <div id="messageContent">
        <Markdown options={markdownOptions}>{message.content}</Markdown>
        {uploads.map(upload => <img className="upload" src={authUrl+upload.url} onClick={() => {
          states.setActivePopover(<Popover style={{background: "transparent", boxShadow: "none"}} title={upload.name}>
            <img src={authUrl+upload.url} style={{borderRadius: 10, boxShadow: "0px 0px 10px black"}}/>
            <a href={authUrl+upload.url} style={{color: "white"}}>Download this image</a>
          </Popover>);
        }}/>)}
      </div>
    </div>
    <div className="message3">
      <button className='material-symbols-outlined' hidden={
        sentByThisUser ? !states.focusedServerPermissions.includes("message.edit")
        : true // You shouldn't be able to edit other people's messages no matter what
      }>Edit</button>
      <button className='material-symbols-outlined'>Reply</button>
      <button className='material-symbols-outlined'>alternate_email</button>
      <button className='material-symbols-outlined' hidden={
        sentByThisUser ? !states.focusedServerPermissions.includes("message.delete")
        : !states.focusedServerPermissions.includes("moderation.delete")
      }>Delete</button>
    </div>
  </div>);
}

function triggerMessageSend() {
  let socket = openSockets[states.focusedServer];
  let messageTextBox = document.getElementById("messageBox");
  socket.send(JSON.stringify({
    "eventType": "message",
    "message": {
      "content": messageTextBox.innerText
    }
  }));
  messageTextBox.innerHTML = "";
}

// A SLIGHTLY DIFFERENT COMMENT
function RoomsBar({shown, className, ...props}) {
  return (<div className={className + " sidebar"} id="roomsBar" style={{display: shown ? "flex" : "none"}} {...props}>
    <div id="serverTitle" style={{cursor: "pointer", backgroundImage: states.focusedServer ? states.servers[states.focusedServer].manifest.icon : ""}}>
    <h3 style={{margin: 5}}>
      {states.focusedServer ? states.servers[states.focusedServer].manifest.title : "Loading servers..."}
    </h3>
    <div style={{flexGrow: 1}}></div>
    <span className="material-symbols-outlined">stat_minus_1</span></div>
    {Object.values(states.focusedServerRenderedRooms).map(room => (<RoomLink server={room}></RoomLink>))}
    {Object.values(states.focusedServerRenderedRooms).length == 0 ? <p>This server doesn't have any rooms in it.</p> : <></>}
  </div>);
}

// a comment
function RoomLink({room}) {
  return (<div className="roomLink" style={{cursor:"pointer"}}>
    <a>{room.name}</a>
  </div>);
}

// The bar on the left showing the servers you're in, also for navigation
function ServersBar({shown, className, ...props}) {
  return (<div className={className + " sidebar"} id="serversBar" style={{display: shown ? "flex" : "none"}} {...props}>
    <img className="serverIcon" src="" alt="+" id="newServerButton"/>
    {Object.values(states.servers).map(server => (<ServerIcon server={server}></ServerIcon>))}
  </div>);
}

// a server icon button thing
function ServerIcon({server}) {
  [server.manifest, server.setManifest] = React.useState({
    icon: "",
    title: "Couldn't connect to this server 🐙"
  });
  return (<div className="tooltipContainer">
    <img className="serverIcon" src={server.manifest.icon} alt="🐙" onClick={()=>{
      states.setFocusedServer(server.serverCode);
      loadView(server.serverCode);
    }}/>
    <div className="serverIconTooltip">{server.manifest.title}</div>
  </div>);
}

// The bar on the right showing other server members
function PeersBar({shown, className, ...props}) {
  return (<div className={className + " sidebar"} id="peersBar" style={{display: shown ? "flex" : "none"}} {...props}>
    <img className="serverIcon material-symbols-outlined" src="" alt="+" id="inviteButton" onClick={() => {
      openSockets[states.focusedServer].send(JSON.stringify({
        eventType: "message",
        message: {
          content: "/invite"
        }
      }));
    }}/>
    {states.focusedServerPeers.map(peer => {
      <PeerIcon peer={peer}/>
    })}
  </div>);
}

function PeerIcon({peer}) {
  let [peerInfo, setPeerInfo] = React.useState(userCache[peer.id]);
  fetchUser(peer.id).then(setPeerInfo);
  return (<img src={peerInfo.avatar} className="serverIcon avatar" alt="🐙" style={{
    opacity: peer.online ? 1 : 0.5
  }}/>);
}

function loadMoreMessages() {
  openSockets[states.focusedServer].send(JSON.stringify({
    eventType: "messageLoad",
    start: loadedMessages,
    max: 100
  }));
}

// The document head contains metadata, most of it is defined in use-site-metadata.jsx
export const Head = () => (
  <title>(Beta!) Platypuss</title>
);

function showInvitePopup(invite, domain) {
  // thing
  let ip = [ // the first 8 characters are the ip address in hex form
    Number("0x"+invite[0]+invite[1]).toString(),
    Number("0x"+invite[2]+invite[3]).toString(),
    Number("0x"+invite[4]+invite[5]).toString(),
    Number("0x"+invite[6]+invite[7]).toString()].join(".");
  let subserver = ip;
  if (domain !== null) {
    ip = domain;
  }
  let port = 0;
  for (let c = 8; c + 2 < invite.length; c++) {
    port = port * 16 + parseInt(invite[c], 16);
  }
  let code = Number("0x"+invite[invite.length - 2]+invite[invite.length - 1]).toString();
  fetch(`http${pageUrl.protocol == "https:" ? "s" : ""}://${ip}:${port}/${subserver}`).then(res => res.json()).then(data => {
    states.setActivePopover(
      <Popover title={"You've been invited to join "+(data.title ? data.title.toString() : "an untitled server")}>
        <div className='inviteServerBanner'>
          <img className='avatar inviteServerIcon' alt="🐙" src={data.icon}/>
          <p>IP address: {ip}:{port}
          <br/>{data.memberCount} members</p>
        </div>
        <div style={{border: "1px solid var(--grey)",padding:3}}><Markdown options={markdownOptions}>{data.description}</Markdown></div>
        <div style={{flexGrow: 1}}/>
        <button onClick={() => {
          if (states.accountInformation.username) {
            fetch(authUrl+`/joinServer?id=${localStorage.getItem("sessionID")}&ip=${ip}:${port}+${code}+${subserver}`).then(() => {
              window.location = "/chat";
            }).catch(error => {
              states.setActivePopover(
                <Popover title="Couldn't join the server">
                  <p>We don't know why this happened but you might be able to try reload the page.<br/>
                  Here's an error message:<br/><code>{error.toString()}</code></p>
                </Popover>
              );
            });
          } else {
            states.setActivePopover(<CreateAccountPopover/>);
          }
        }}>Accept</button>
        <button onClick={() => {window.location = states.accountInformation.username ? "/chat" : "/"}}>Decline</button>
      </Popover>
    );
  }).catch(error => {
    states.setActivePopover(
      <Popover title="You were invited to join a server but we couldn't connect.">
        <div className='inviteServerBanner'>
          <img className='avatar inviteServerIcon' alt="🐙"/>
          <p>IP address: {ip}:{port}
          <br/>Error message: <code>{error.toString()}</code></p>
        </div>
        <div style={{flexGrow: 1}}/>
        {/*<button>Accept Anyway</button>*/}
        <button onClick={() => {window.location = '/chat'}}>Close</button>
      </Popover>
    );
  });
}

async function loadView(switchToServer) {
  // don't try load the client as part of the page compiling
  if (!browser) return;
  window.onkeydown = event => {
    if (event.key == "Escape") {
      states.setActivePopover(null);
    }
  };
  if (pageUrl.searchParams.has("invite")) {
    showInvitePopup(pageUrl.searchParams.get("invite"), pageUrl.searchParams.get("ip"));
  }

  // delete all messages
  states.setFocusedRoomRenderedMessages([]);
  finishedLoading = false;
  // connect to the authentication server to get the list of server's we're in and their session tokens
  fetch(`${authUrl}/getServerTokens?id=${localStorage.getItem("sessionID")}`).then(data => data.json()).then(async function(data) {
    for (let socket of Object.values(openSockets)) {
      socket.close();
    }
    for (let serverName in data.servers) { // this for loop lets us keep the same server focused between reloads
      serverHashes[serverName] = hashPassword(serverName); // it's not a password but who cares
      if (window.location.toString().replace(/^.*\#/g, "") == serverHashes[serverName] && !switchToServer) {
        states.setFocusedServer(serverName);
      }
    }
    let servers = {};
    for (let serverCode in data.servers) {
      let splitServerCode = serverCode.split(' '); // take the data the authentication server gives us about the server and use it to connect
      let ip = splitServerCode[0];
      let inviteCode = splitServerCode[1];
      let subserver = splitServerCode[2];
      servers[serverCode] = { // add this server to our list of servers, making an icon
        ip: ip,
        serverCode: serverCode,
        inviteCode: inviteCode,
        subserver: subserver,
        manifest: { // we haven't actually heard from the server itself what its icon, name etc are
          title: "Loading",
          icon: "/icon.png",
          memberCount: 0,
          public: false,
          description: "Waiting for a response from the server"
        }
      };
      // Open a socket connection with the server
      let socket = new WebSocket((pageUrl.protocol == "https:" ? "wss:" : "ws") + "//" + ip);

      socket.onerror = () => {
        // The server's disconnected, in which case if we're focusing on it we should focus on a different server
        console.error(`Warning: couldn't connect to ${ip}, try check your internet connection or inform the owner(s) of the server.`);
        if (states.focusedServer == serverCode) {
          // window.location.reload();
        }
      };

      socket.onopen = () => { // Send a login packet to the server once the connection is made
        openSockets[serverCode] = socket;
        socket.send(JSON.stringify({
          eventType: "login",
          subserver: subserver,
          inviteCode: inviteCode,
          sessionID: data.servers[serverCode]
        }));
        if (!states.servers[states.focusedServer]) {
          if (states.servers[switchToServer]) {
            states.setFocusedServer(switchToServer);
          } else {
            states.setFocusedServer(serverCode);
          }
        }
        if (states.focusedServer == serverCode) {
          window.history.pushState({}, "", "#"+serverHashes[serverCode]);
        }
      };

      socket.onclose = () => {
        // same as onerror above
        console.error(`Warning, the server at ${ip} closed.`);
        if (states.focusedServer == serverCode) {
          // window.location.reload();
        }
      };

      socket.onmessage = async event => {
        let packet = JSON.parse(event.data);
        switch (packet.eventType) {
          case "message":
            if (document.visibilityState == "hidden" && data.userId != packet.message.author)
              new Audio(authUrl+'/randomsand.wav').play();
            if (states.focusedServer !== serverCode) break;
            // cache the message and add it to the list to render
            messageCache[packet.message.id] = packet.message;
            states.setFocusedRoomRenderedMessages([
              ...states.focusedRoomRenderedMessages,
              messageCache[packet.message.id]
            ]);
            loadedMessages++;
            break;
          case "messages":
            if (states.focusedServer !== serverCode) break;
            for (let messageID in packet.messages) {
              packet.messages[messageID].isHistoric = true; // whether it was sent before we loaded the page
              messageCache[packet.messages[messageID].id] = {...packet.messages[messageID]};
            }
            states.setFocusedRoomRenderedMessages([
              ...packet.messages,
              ...states.focusedRoomRenderedMessages
            ]);
            loadedMessages += packet.messages.length;
            setTimeout(() => { finishedLoading = true; }, 1000);
            break;
          case "connected":
            if (servers[serverCode].setManifest)
              servers[serverCode].setManifest(packet.manifest);
            else 
              servers[serverCode].manifest = packet.manifest;
            if (serverCode == states.focusedServer) {
              states.setFocusedServerPermissions(packet.permissions);
              states.setFocusedServerPeers(Object.values(packet.peers));
            }
            break;
          case "connecting":
          case "disconnect":
          case "join":
          case "welcome":
            break; // we don't care about these
          default:
            if ("explanation" in packet && states.focusedServer === serverCode) {
              let randomString = Math.random().toString();
              messageCache[randomString] = {
                special: true,
                author: null,
                content: packet.explanation.toString(),
                id: randomString
              };
              states.setFocusedRoomRenderedMessages([
                ...states.focusedRoomRenderedMessages,
                messageCache[randomString]
              ]);
            }
            console.log(packet.explanation);
            break;
        }
      };
    }
    // update our list of servers and if no server is currently focused pick the first one
    states.setServers(servers);
  }).catch(error => console.log(error));
}

function PageHeader ({title, iconClickEvent, ...props}) {
  [states.accountInformation, states.setAccountInformation] = React.useState({});

  React.useEffect(() => {
      fetch(authUrl + "/uinfo?id=" + localStorage.getItem("sessionID"))
          .then(data => data.json())
          .then(data => states.setAccountInformation(data))
          .catch(() => { if (pageUrl.pathname == "/chat") window.location = "/" });
  }, []);

  let difficultySliderRef = React.useRef(null);
  React.useEffect(() => {
    switch (localStorage.getItem("theme")) {
      case "dark":
        difficultySliderRef.current.value = 0;
        break;
      case "medium":
        difficultySliderRef.current.value = 1;
        break;
      case "light":
        difficultySliderRef.current.value = 2;
        break;
      case "green":
        difficultySliderRef.current.value = 3;
        break;
      default:
        break;
    }
  }, []);

  return (<header {...props}>
      <img className="avatar" onClick={iconClickEvent ? iconClickEvent : () => {window.location = "/"}} style={{cursor: "pointer"}} src="/icons/icon-48x48.png"/>
      <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
          {title ? title : "(Beta!) Platypuss"}
      </h2>
      <div style={{flexGrow: 1}}></div>
      <img className="avatar" style={{cursor: "pointer"}} src={authUrl+states.accountInformation.avatar} onClick={() => {
        states.setActivePopover(
          <Popover title="Account Settings">
            <div id="profileBanner">
              <div className="avatar" id="changeAvatarHoverButton">
                <span>Change</span>
                <img className='avatar' id="changeAvatar" src={authUrl+states.accountInformation.avatar}/>
              </div>
              <span id="accountSettingsUsername" contentEditable>{states.accountInformation.username}</span>
            </div>
            <div contentEditable id="changeAboutMe"></div>
            <fieldset id="themeRadioButtons">
              <legend>Difficulty:</legend>
              <input type="range" min="0" max="3" ref={difficultySliderRef} className="slider" id="difficultySlider" onInput={() => {
                if (difficultySliderRef.current.value < 1) {
                  setTimeout(()=>{states.setTheme("dark"); localStorage.setItem("theme", "dark");});
                } else if (difficultySliderRef.current.value < 2) {
                  setTimeout(()=>{states.setTheme("medium"); localStorage.setItem("theme", "medium");});
                } else if (difficultySliderRef.current.value < 3) {
                  setTimeout(()=>{states.setTheme("light"); localStorage.setItem("theme", "light");});
                } else if (difficultySliderRef.current.value < 4) {
                  setTimeout(()=>{states.setTheme("green"); localStorage.setItem("theme", "green");});
                }
              }}/>
              {/*
              <div>
                <input type="radio" id="darkThemeRadioButton" checked={states.theme == "dark"}
                  onChange={() => {setTimeout(()=>{states.setTheme("dark"); localStorage.setItem("theme", "dark");})}}/>
                <label for="darkThemeRadioButton">Easy</label>
              </div>
              <div>
                <input type="radio" id="mediumThemeRadioButton" checked={states.theme == "medium"}
                  onChange={() => {setTimeout(()=>{states.setTheme("medium"); localStorage.setItem("theme", "medium");})}}/>
                <label for="mediumThemeRadioButton">Medium</label>
              </div>
              <div>
                <input type="radio" id="lightThemeRadioButton" checked={states.theme == "light"}
                  onChange={() => {setTimeout(()=>{states.setTheme("light"); localStorage.setItem("theme", "light");}, 50)}}/>
                <label for="lightThemeRadioButton">Hard</label>
              </div>
              <div>
                <input type="radio" id="greenThemeRadioButton" checked={states.theme == "green"}
                  onChange={() => {setTimeout(()=>{states.setTheme("green"); localStorage.setItem("theme", "green");}, 50)}}/>
                <label for="greenThemeRadioButton">Harder</label>
              </div>*/}
            </fieldset>
            <button>Delete Account</button>
            <button>Change Password</button>
            <button onClick={() => {
              localStorage.setItem("sessionID", null);
              window.location.reload();
            }}>Log Out</button>
            <button onClick={() => {states.setActivePopover(null);}}>Done</button>
          </Popover>
        );
      }}/>
  </header>);
};

// The page itself
export default function ChatPage() {
  let theme = "medium";
  if (browser) {
    switch (localStorage.getItem("theme")) {
      case "dark":
      case "light":
      case "green":
      case "medium":
        theme = localStorage.getItem("theme");
        break;
      default:
        break;
    }
  }

  // set a bunch of empty React state objects for stuff that needs to be accessed throughout the program
  [states.servers, states.setServers] = React.useState({}); // Data related to servers the user is in
  [states.focusedServerPermissions, states.setFocusedServerPermissions] = React.useState({}); // what permissions we have in the currently focused server
  [states.focusedRoomRenderedMessages, states.setFocusedRoomRenderedMessages] = React.useState([]); // The <Message/> elements shown in the view, set in ChatPage
  [states.focusedServer, states.setFocusedServer] = React.useState(null); // An object representing the currently focused server
  [states.focusedRoom, states.setFocusedRoom] = React.useState({}); // An object representing the currently focused room
  [states.focusedServerRenderedRooms, states.setFocusedServerRenderedRooms] = React.useState([]); // The <RoomLink/> elements in the sidebar for this server
  [states.mobileSidebarShown, states.setMobileSidebarShown] = React.useState(true); // whether to show the sidebar on mobile devices, is open by default when you load the page
  [states.useMobileUI, states.setUseMobileUI] = React.useState(browser ? (window.innerWidth * 2.54 / 96) < 20 : false); // Use mobile UI if the screen is less than 20cm wide
  [states.focusedServerPeers, states.setFocusedServerPeers] = React.useState([]); // other people in this server
  [states.theme, states.setTheme] = React.useState(theme);

  React.useEffect(() => { loadView(); }, []);
  
  // return the basic page layout
  return (<>
    <PageHeader className={states.theme == "green" ? "greenThemed" : states.theme == "light" ? "lightThemed" : "darkThemed"} iconClickEvent={() => {
      if (states.useMobileUI) {
        setTimeout(() => {
          if (states.mobileSidebarShown)
            states.setMobileSidebarShown(false);
          else
            states.setMobileSidebarShown(true);
        }, 50);
      } else {
        window.location = "/";
      }
    }} states={states}/>
    <main>
      <div id="chatPage">
        <ServersBar className={states.theme == "green" ? "greenThemed" : states.theme == "light" ? "lightThemed" : "darkThemed"} shown={(states.mobileSidebarShown && !states.activePopover) || !states.useMobileUI}/>
        <RoomsBar className={states.theme == "green" ? "greenThemed" : states.theme == "light" ? "lightThemed" : "darkThemed"} shown={(states.mobileSidebarShown && !states.activePopover) || !states.useMobileUI}/>
        <MiddleSection
          className={states.theme == "green" ? "greenThemed" : states.theme == "dark" ? "darkThemed" : "lightThemed"}
          shown={(!states.mobileSidebarShown && !states.activePopover) || !states.useMobileUI}
        />
        <PeersBar className={states.theme == "green" ? "greenThemed" : states.theme == "light" ? "lightThemed" : "darkThemed"} shown={(states.mobileSidebarShown && !states.activePopover) || !states.useMobileUI}/>
        <PopoverParent className={states.theme == "green" ? "greenThemed" : states.theme == "dark" ? "darkThemed" : "lightThemed"}/>
      </div>
    </main>
  </>);
}
