"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[649],{4852:function(e,t,r){r.d(t,{z:function(){return n}});var s=r(6540);const n=({title:e})=>s.createElement("header",null,s.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"))},6965:function(e,t,r){r.r(t),r.d(t,{Head:function(){return S},default:function(){return h}});var s=r(4852),n=r(6540),a={},o={populated:!1},l={},c={},i=window?new URL(window.location):new URL("http://localhost:8000"),u="https://platypuss.net";function d(e,t=20){let r=3735928559^t,s=1103547991^t;for(let n,a=0;a<e.length;a++)n=e.charCodeAt(a),r=Math.imul(r^n,2654435761),s=Math.imul(s^n,1597334677);return r=Math.imul(r^r>>>16,2246822507)^Math.imul(s^s>>>13,3266489909),s=Math.imul(s^s>>>16,2246822507)^Math.imul(r^r>>>13,3266489909),(s>>>0).toString(16).padStart(8,0)+(r>>>0).toString(16).padStart(8,0)}function m(){return n.createElement("div",{className:"sidebar",id:"serversBar"},n.createElement("img",{className:"serverIcon",src:"",alt:"+",id:"newServerButton"}),Object.values(o.servers).map((e=>n.createElement(g,{server:e,serverBar:this}))))}function v({focusedServer:e}){return n.createElement("div",{className:"sidebar",id:"serversBar"},n.createElement("img",{className:"serverIcon material-symbols-outlined",src:"",alt:"+",id:"newServerButton"}))}function f({message:e}){return n.createElement("div",{className:"message1"},n.createElement("img",{src:a[e.author].avatar,alt:""}),n.createElement("div",{className:"message2"},n.createElement("h3",{className:"messageUsernameDisplay"},a[e.author].username),n.createElement("p",null,e.content)))}function p(){return n.createElement("div",{id:"middleSection"},n.createElement("div",{id:"aboveScrolledArea"}),n.createElement("div",{id:"scrolledArea"}," ",n.createElement("div",{id:"aboveMessageArea"}),n.createElement("div",{id:"messageArea"},Object.values(o.focusedRoomRenderedMessages).map((e=>n.createElement(f,null)))),n.createElement("div",{id:"belowMessageArea"})),n.createElement("div",{id:"belowScrolledArea"}))}function g({server:e,serverBar:t}){return[e.manifest,e.setManifest]=n.useState({iconURL:"",serverTitle:"connecting to the server???"}),n.createElement("img",{className:"serverIcon",src:e.manifest.iconURL,alt:"🐙"})}i.protocol="https";const S=()=>n.createElement("title",null,"(Beta!) Platypuss");function h(){return[o.servers,o.setServers]=n.useState({}),[o.focusedRoomRenderedMessages,o.setFocusedRoomRenderedMessages]=n.useState({}),[o.focusedServer,o.setFocusedServer]=n.useState({manifest:{}}),[o.focusedRoom,o.setFocusedRoom]=n.useState({}),[o.focusedServerRenderedRooms,o.setFocusedServerRenderedRooms]=n.useState({}),console.log(o.populated),o.populated||async function(){for(let e of Object.keys(o.focusedRoomRenderedMessages))delete o.focusedRoomRenderedMessages[e];o.setFocusedRoomRenderedMessages({}),fetch(`${u}/getServerTokens?id=${localStorage.getItem("sessionID")}`).then((e=>e.json())).then((async function(e){for(let r of Object.values(l))r.close();for(let r in e.servers)c[r]=d(r),o.focusedServer=={manifest:{}}&&window.location.toString().replace(/^.*\#/g,"")==c[r]&&(o.focusedServer=r);let t={};for(let r of Object.keys(e.servers)){let e=r.split(" "),s=e[0],n=e[1],a=e[2];console.log(i.protocol+"//"+s.toString()),t[r]={ip:s,inviteCode:n,subserver:a,manifest:{title:"Loading",icon:"/icon.png",memberCount:0,public:!1,description:"Waiting for a response from the server"}},fetch(i.protocol+"//"+s.toString()).then((e=>e.json)).then((e=>{console.log(e)})).catch((e=>{console.log(e)}))}o.setServers(t),o.focusedServer=={manifest:{}}&&o.setFocusedServer(o.servers[Object.keys(e.servers)[0]])}))}(),o.populated=!0,n.createElement(n.Fragment,null,n.createElement(s.z,{title:o.focusedServer.manifest.title}),n.createElement("main",null,n.createElement("div",{id:"chatPage"},n.createElement(m,null),n.createElement(p,null),n.createElement(v,null))))}}}]);
//# sourceMappingURL=component---src-pages-chat-js-309e423e207688977e36.js.map