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

import * as Common from "../components/common";
import * as React from "react";
import "./light.scss";

var userCache = {}; // A cache of data on users so we don't constantly have to look it up
var messageCache = {}; // The same but for messages, we might not need this
var permissions = {}; // The permissions we have, key being an identifier and value being a friendly description
var states = {populated:false}; // One global variable for storing React state objects so we can access them anywhere
var openSockets = {}; // Keeps track of open websockets
var peers = {}; // Keeps track of other people on the server (platonically of course :3)
var loadedMessages = 0; // The number of messages loaded in the current view, used when loading older messages
var serverHashes = {}; // We can use these to get links to specific servers / maybe rooms in the future
var browser = typeof window !== "undefined"; // check if we're running in a browser rather than the build environment

var pageUrl = browser ? new URL(window.location) : new URL("http://localhost:8000"); // window is not defined in the testing environment so just assume localhost
var authUrl = "https://platypuss.net"; // Authentication server, you shouldn't have to change this but it's a variable just in case
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
pageUrl.protocol = "https"; // remove this in production

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

// The bar on the left showing the servers you're in, also for navigation
function ServersBar({shown}) {
  return (<div className="sidebar" id="serversBar" style={{display: shown ? "flex" : "none"}}>
    <img className="serverIcon" src="" alt="+" id="newServerButton"/>
    {Object.values(states.servers).map(server => (<ServerIcon server={server}></ServerIcon>))}
  </div>);
}

// The bar on the right showing other server members
function PeersBar({shown}) {
  return (<div className="sidebar" id="serversBar" style={{display: shown ? "flex" : "none"}}>
    <img className="serverIcon material-symbols-outlined" src="" alt="+" id="newServerButton"/>
  </div>);
}

// Renders a single message
function Message({message}) {
  // We might have the author cached already, if not we'll just get them later
  let [author, setAuthor] = React.useState(userCache[message.author] || {
    avatar: "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg",
    username: "Deleted User"
  });
  fetchUser(message.author).then(newAuthor=>{setAuthor(newAuthor)});
  return (<div className="message1">
    <img src={author.avatar} alt="" className="avatar"/>
    <div className="message2">
      <h3 className="messageUsernameDisplay">{author.username}</h3>
      <p>{message.content.toString()}</p>
    </div>
  </div>);
}

// The midsection between these two aforementioned bars
function MiddleSection({shown}) {
  return (<div id="middleSection" style={{display: shown ? "flex" : "none"}}>
    <div id="aboveScrolledArea"></div>
    <div id="scrolledArea"> {/* Has a scrollbar, contains load more messages button but not message typing box */}
      <div id="aboveMessageArea"></div>
      <div id="messageArea">{Object.values(states.focusedRoomRenderedMessages).map(message => <Message message={message}/>)}</div>
      <div id="belowMessageArea"></div>
    </div>
    <div style={{height:5,background:"linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3))"}}></div>
    <div id="belowScrolledArea">
      <div contentEditable id="messageBox" onKeyDown={event=>{
        if (event.key == "Enter" && !states.useMobileUI && !event.shiftKey) {
          triggerMessageSend();
          event.preventDefault();
        }
      }}></div>
      <button>upload</button>
      <button onClick={triggerMessageSend}>send</button>
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

// a server icon button thing
function ServerIcon({server}) {
  [server.manifest, server.setManifest] = React.useState({
    icon: "",
    title: "Couldn't connect to this server 🐙"
  });
  return (<div className="popoverContainer">
    <img className="serverIcon" src={server.manifest.icon} alt="🐙" onClick={()=>{
      states.setFocusedServer(server.serverCode);
      loadView(server.serverCode);
    }}/>
    <div className="serverIconPopover">{server.manifest.title}</div>
  </div>);
}

// a comment
function RoomLink({room}) {
  return (<div className="roomLink" style={{cursor:"pointer"}}>
    <a>{room.name}</a>
  </div>);
}

// A SLIGHTLY DIFFERENT COMMENT
function RoomsBar({shown}) {
  return (<div className="sidebar" id="roomsBar" style={{display: shown ? "flex" : "none"}}>
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

// The document head contains metadata, most of it is defined in use-site-metadata.jsx
export const Head = () => (
  <title>(Beta!) Platypuss</title>
);

async function loadView(switchToServer) {
  // don't try load the client as part of the page compiling
  if (!browser) return;
  // delete all messages
  states.setFocusedRoomRenderedMessages({});
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
      // get this information from the server
      fetch(pageUrl.protocol + "//"+ip+"/"+subserver).then(response => response.json()).then(serverManifest => {
        servers[serverCode].setManifest(serverManifest);
      }).catch(error => {console.log(error)});
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
        let renderedMessages;
        switch (packet.eventType) {
          case "message":
            if (document.visibilityState == "hidden" && data.userId != packet.message.author)
              new Audio(authUrl+'/uploads/93c70e82-b447-4794-99d9-3ab070d659ea/f3cb5ab570a29417524422d17b4e4a4db33b5900df8127688ffcf352df17383f79e1cfa87d9c6ab9ce4b47e90d231d22a805597dd719fbf01fe6da6d047d7290').play();
            if (states.focusedServer !== serverCode) break;
            renderedMessages = {...states.focusedRoomRenderedMessages};
            renderedMessages[packet.message.id] = packet.message;
            states.setFocusedRoomRenderedMessages(renderedMessages);
            break;
          case "messages":
            if (states.focusedServer !== serverCode) break;
            renderedMessages = {...states.focusedRoomRenderedMessages};
            for (let message of packet.messages) {
              renderedMessages[message.id] = message;
            }
            states.setFocusedRoomRenderedMessages(renderedMessages);
            break;
          case "connecting":
            break;
          default:
            if ("explanation" in packet && states.focusedServer === serverCode) {
              renderedMessages = {...states.focusedRoomRenderedMessages};
              let randomString = Math.random().toString();
              renderedMessages[randomString] = {
                special: true,
                author: null,
                content: packet.explanation.toString(),
                id: randomString
              };
              states.setFocusedRoomRenderedMessages(renderedMessages);
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

// The page itself
export default function ChatPage() {
  // set a bunch of empty React state objects for stuff that needs to be accessed throughout the program
  [states.servers, states.setServers] = React.useState({}); // Data related to servers the user is in
  [states.focusedRoomRenderedMessages, states.setFocusedRoomRenderedMessages] = React.useState({}); // The <Message/> elements shown in the view, set in ChatPage
  [states.focusedServer, states.setFocusedServer] = React.useState(null); // An object representing the currently focused server
  [states.focusedRoom, states.setFocusedRoom] = React.useState({}); // An object representing the currently focused room
  [states.focusedServerRenderedRooms, states.setFocusedServerRenderedRooms] = React.useState({}); // The <RoomLink/> elements in the sidebar for this server
  [states.mobileSidebarShown, states.setMobileSidebarShown] = React.useState(true); // whether to show the sidebar on mobile devices, is open by default when you load the page
  [states.useMobileUI, states.setUseMobileUI] = React.useState(browser ? (window.innerWidth * 2.54 / 96) < 20 : false); // Use mobile UI if the screen is less than 20cm wide

  // respond to changes in screen width, TODO: seems to cause performance issues on wayland, need to look into it
  if (browser)
  window.addEventListener("resize", () => {
    states.setUseMobileUI(browser ? (window.innerWidth * 2.54 / 96) < 20 : false);
  });

  if (!states.populated) loadView();
  states.populated = true;
  // return the basic page layout
  return (<>
    <Common.PageHeader iconClickEvent={() => {
      if (states.useMobileUI) {
        states.setMobileSidebarShown(!states.mobileSidebarShown);
      } else {
        window.location = "/";
      }
    }}/>
    <main>
      <div id="chatPage">
        <ServersBar shown={states.mobileSidebarShown || !states.useMobileUI}/>
        <RoomsBar shown={states.mobileSidebarShown || !states.useMobileUI}/>
        <MiddleSection shown={!states.mobileSidebarShown || !states.useMobileUI}/>
        <PeersBar shown={states.mobileSidebarShown || !states.useMobileUI}/>
      </div>
    </main>
  </>);
}
