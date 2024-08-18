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

var pageUrl = typeof window !== "undefined" ? new URL(window.location) : new URL("http://localhost:8000"); // window is not defined in the testing environment so just assume localhost
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
function ServersBar() {
  return (<div className="sidebar" id="serversBar">
    <img className="serverIcon" src="" alt="+" id="newServerButton"/>
    {Object.values(states.servers).map(server => (<ServerIcon server={server} serverBar={this}></ServerIcon>))}
  </div>);
}

// The bar on the right showing other server members
function PeersBar({focusedServer}) {
  return (<div className="sidebar" id="serversBar">
    <img className="serverIcon material-symbols-outlined" src="" alt="+" id="newServerButton"/>
  </div>);
}

// Renders a single message
function Message({message}) {
  return (<div className="message1">
    <img src={userCache[message.author].avatar} alt=""/>
    <div className="message2">
      <h3 className="messageUsernameDisplay">{userCache[message.author].username}</h3>
      <p>{message.content}</p>
    </div>
  </div>);
}

// The midsection between these two aforementioned bars
function MiddleSection() {
  return (<div id="middleSection">
    <div id="aboveScrolledArea"></div>
    <div id="scrolledArea"> {/* Has a scrollbar, contains load more messages button but not message typing box */}
      <div id="aboveMessageArea"></div>
      <div id="messageArea">{Object.values(states.focusedRoomRenderedMessages).map(message => <Message/>)}</div>
      <div id="belowMessageArea"></div>
    </div>
    <div id="belowScrolledArea"></div>
  </div>);
}

// a server icon button thing
function ServerIcon({server, serverBar}) {
  [server.manifest, server.setManifest] = React.useState({
    iconURL: "",
    serverTitle: "connecting to the server???"
  });
  return (<img className="serverIcon" src={server.manifest.iconURL} alt="🐙"/>);
}

// The document head contains metadata, most of it is defined in use-site-metadata.jsx
export const Head = () => (
  <title>(Beta!) Platypuss</title>
);

async function loadView() {
  // don't try load the client as part of the build process
  if (typeof window === "undefined") return;
  // connect to the authentication server to get the list of server's we're in and their session tokens
  for (let message of Object.keys(states.focusedRoomRenderedMessages)) {
    delete states.focusedRoomRenderedMessages[message];
  }
  states.setFocusedRoomRenderedMessages({});
  fetch(`${authUrl}/getServerTokens?id=${localStorage.getItem("sessionID")}`).then(data => data.json()).then(async function(data) {
    for (let socket of Object.values(openSockets)) {
      socket.close();
    }
    for (let serverName in data.servers) { // this for loop lets us keep the same server focused between reloads
      serverHashes[serverName] = hashPassword(serverName); // it's not a password but who cares
      if (states.focusedServer == {manifest:{}}) {
        if (window.location.toString().replace(/^.*\#/g, "") == serverHashes[serverName]) {
          states.focusedServer = serverName;
        }
      }
    }
    let servers = {};
    for (let serverCode of Object.keys(data.servers)) {
      let splitServerCode = serverCode.split(' ');
      let ip = splitServerCode[0];
      let inviteCode = splitServerCode[1];
      let subserver = splitServerCode[2];
      servers[serverCode] = {
        ip: ip,
        inviteCode: inviteCode,
        subserver: subserver,
        manifest: {
          title: "Loading",
          icon: "/icon.png",
          memberCount: 0,
          public: false,
          description: "Waiting for a response from the server"
        }
      };
      fetch(pageUrl.protocol + "//"+ip.toString()+"/"+subserver).then(response => response.json()).then(serverManifest => {
        console.log(serverManifest);
      }).catch(error => {console.log(error)});
    }
    states.setServers(servers);
    if (states.focusedServer == {manifest:{}}) {
      states.setFocusedServer(states.servers[Object.keys(data.servers)[0]]);
    }
  }).catch(error => console.log(error));
}

// The page itself
export default function ChatPage() {
  // set a bunch of empty React state objects for stuff that needs to be accessed throughout the program
  [states.servers, states.setServers] = React.useState({}); // Data related to servers the user is in
  [states.focusedRoomRenderedMessages, states.setFocusedRoomRenderedMessages] = React.useState({}); // The <Message/> elements shown in the view, set in ChatPage
  [states.focusedServer, states.setFocusedServer] = React.useState({manifest:{}}); // An object representing the currently focused server
  [states.focusedRoom, states.setFocusedRoom] = React.useState({}); // An object representing the currently focused room
  [states.focusedServerRenderedRooms, states.setFocusedServerRenderedRooms] = React.useState({}); // The <RoomLink/> elements in the sidebar for this server
  
  console.log(states.populated);
  if (!states.populated) loadView();
  states.populated = true;
  // return the basic page layout
  return (<>
    <Common.PageHeader title={states.focusedServer.manifest.title}/>
    <main>
      <div id="chatPage">
        <ServersBar/>
        <MiddleSection/>
        <PeersBar/>
      </div>
    </main>
  </>);
}
