"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[293],{4852:function(e,t,a){a.d(t,{z:function(){return l}});var n=a(6540);const l=({title:e,iconClickEvent:t,states:a,...l})=>([a.accountInformation,a.setAccountInformation]=n.useState({}),n.createElement("header",l,n.createElement("img",{className:"avatar",onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-48x48.png"}),n.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"),n.createElement("div",{style:{flexGrow:1}}),n.createElement("img",{className:"avatar",style:{cursor:"pointer"},src:a.accountInformation.avatar})))},2020:function(e,t,a){a.r(t),a.d(t,{Head:function(){return h}});var n=a(4852),l=a(6540);var r="undefined"!=typeof window;var s,o,i={};function c(e,t=20){let a=3735928559^t,n=1103547991^t;for(let l,r=0;r<e.length;r++)l=e.charCodeAt(r),a=Math.imul(a^l,2654435761),n=Math.imul(n^l,1597334677);return a=Math.imul(a^a>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(a^a>>>13,3266489909),(n>>>0).toString(16).padStart(8,0)+(a>>>0).toString(16).padStart(8,0)}var m=!1;function u(){fetch("https://platypuss.net/login",{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({createNew:m,ift:m,server:"example.com",ser:"example.com",email:s.current.value,pwd:c(o.current.value),password:c(o.current.value)})}).then((e=>e.json())).then((e=>{console.log(e),localStorage.setItem("sessionID",e.sessionID),window.location="/chat"}))}t.default=()=>{s=l.useRef(null),o=l.useRef(null);let e="medium";return r&&localStorage.getItem("theme")&&(e=localStorage.getItem("theme")),[i.theme,i.setTheme]=l.useState(e),l.createElement(l.Fragment,null,l.createElement(n.z,{className:"light"==i.theme?"lightThemed":"darkThemed",states:i}),l.createElement("main",{id:"mainPage",className:"dark"==i.theme?"darkThemed":"lightThemed"},l.createElement("a",{href:"/chat"},"cat"),l.createElement("h1",null,"You found the Platypuss public beta!"),l.createElement("p",null,"This website sees new changes to the Platypuss client before they're published. This means you get to try out new features and improvements before they make their way to the main site. Beware though, many of the changes you see here aren't tested and may break certain functionality. Should anything not work properly you're better off using the ",l.createElement("a",{href:"https://platypuss.net"},"stable version")," of the site."),l.createElement("div",{id:"P",className:"popupParent",style:{display:"flex"}},l.createElement("div",{id:"p",className:"popup"},l.createElement("h2",{id:"lit1"},"Sign In"),l.createElement("span",{id:"lit2"},"Welcome back! If you don't already have an account ",l.createElement("br",null)," please ",l.createElement("a",{href:"https://platypuss.net"},"create an account")," instead."),l.createElement("div",{id:"loginform"},l.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},l.createElement("label",null,"Email address "),l.createElement("input",{type:"email",id:"email",className:"textBox",ref:s}),l.createElement("label",null,"Password "),l.createElement("input",{type:"password",id:"pwd1",className:"textBox",ref:o})),l.createElement("br",null),l.createElement("button",{onClick:u,id:"lit3"},"Sign In"))))),l.createElement("footer",{className:"dark"==i.theme?"darkThemed":"lightThemed"},"links to stuff maybe"))};const h=()=>l.createElement("title",null,"(Beta!) Platypuss")}}]);
//# sourceMappingURL=component---src-pages-index-js-6e5e48da9d17eb6fd0f5.js.map