import * as React from "react";
import "./light.scss";

var servers = {}; // Data related to servers the user is in
var userCache = {}; // A cache of data on users so we don't constantly have to look it up
var messageCache = {}; // The same but for messages
var focusedRoomRenderedMessages = {}; // The <Message/> elements shown in the view
var focusedServerRenderedRooms = {}; // The <RoomLink/> elements in the sidebar for this server
var permissions = {}; // The permissions we have, key being an identifier and value being a friendly description

// Fetch data on one user, from cache if possible but from the authentication server otherwise
export function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (userCache[id] == undefined) {
      fetch("text here")
    }
  });
}

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
