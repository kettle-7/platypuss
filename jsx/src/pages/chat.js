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

import * as React from "react";
import "./light.scss";

var servers = {}; // Data related to servers the user is in
var userCache = {}; // A cache of data on users so we don't constantly have to look it up
var messageCache = {}; // The same but for messages
var focusedRoomRenderedMessages = {}; // The <Message/> elements shown in the view
var focusedServerRenderedRooms = {}; // The <RoomLink/> elements in the sidebar for this server
var permissions = {}; // The permissions we have, key being an identifier and value being a friendly description

var authUrl = "https://platypuss.net"; // Authentication server, you shouldn't have to change this but it's a variable just in case

// Fetch data on one user, from cache if possible but from the authentication server otherwise
export function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (userCache[id] == undefined) {
      // try fetch data from the authentication server
      fetch(authUrl+'/uinfo?id='+id).then(response => {
        // try turn the json response into an object
        response.json().then(responseObject => {
          userCache[id] = responseObject;
          resolve(responseObject);
        }).catch(()=>reject()); // if it's not valid json then reject the promise
      }).catch(()=>reject());
    } else {
      resolve(userCache[id]); // we already know about the user so don't look them up
    }
  });
}

// The bar on the left showing the servers you're in, also for navigation
export function ServersBar({servers}) {
  return (<div className="sidebar" id="serversBar">
    <img className="serverIcon" src="" alt="+" id="newServerButton"/>
    {Object.values(servers).map(server => (<ServerIcon server={server} serverBar={this}></ServerIcon>))}
  </div>);
}

// The bar on the right showing other server members
export function PeersBar({focusedServer}) {
  return (<div className="sidebar" id="serversBar">
    <img className="serverIcon material-symbols-outlined" src="" alt="+" id="newServerButton"/>
  </div>);
}

// The midsection between these two aforementioned bars
export function MiddleSection({focusedServer}) {
  return (<div id="middleSection">
    <div id="aboveScrolledArea"></div>
    <div id="scrolledArea"> {/* Has a scrollbar, contains load more messages button but not message typing box */}
      <div id="aboveMessageArea"></div>
      <div id="messageArea"></div>
      <div id="belowMessageArea"></div>
    </div>
    <div id="belowScrolledArea"></div>
  </div>);
}

// a server icon button thing
export function ServerIcon({server, serverBar}) {
  [server.manifest, server.setManifest] = React.useState({
    iconURL: "",
    serverTitle: "connecting to the server???"
  });
  return (<img className="serverIcon" src="{server.manifest.iconURL}" alt="🐙"/>);
}

// The document head contains metadata, most of it is defined in use-site-metadata.jsx
export const Head = () => (
  <title>(Beta!) Platypuss</title>
);

// The page itself
export default function ChatPage() {
  return (<>
    <header><h2>(Beta!) Platypuss</h2></header>
    <main>
      <div id="chatPage">
        <ServersBar servers={servers}/>
        <MiddleSection/>
        <PeersBar/>
      </div>
    </main>
  </>);
}
