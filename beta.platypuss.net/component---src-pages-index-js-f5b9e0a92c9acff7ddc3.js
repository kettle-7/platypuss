"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[293],{2020:function(e,t,n){n.r(t),n.d(t,{Head:function(){return w}});var a=n(6540);function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r.apply(this,arguments)}var l="undefined"!=typeof window,o=l?new URL(window.location):new URL("http://localhost:8000");const c="https://platypuss.net";var i,s,u,m,d={};function h(e,t=20){let n=3735928559^t,a=1103547991^t;for(let r,l=0;l<e.length;l++)r=e.charCodeAt(l),n=Math.imul(n^r,2654435761),a=Math.imul(a^r,1597334677);return n=Math.imul(n^n>>>16,2246822507)^Math.imul(a^a>>>13,3266489909),a=Math.imul(a^a>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),(a>>>0).toString(16).padStart(8,0)+(n>>>0).toString(16).padStart(8,0)}function p(e){if(e){if(s.current.value!=u.current.value)return void d.setActivePopover(a.createElement(g,{error:"Your passwords don't match"}));if(""==s.current.value.replace(/[\n\r\t ]/g,""))return void d.setActivePopover(a.createElement(g,{error:"Your password must be at least one character"}));if(""==m.current.value.replace(/[\n\r\t ]/g,""))return void d.setActivePopover(a.createElement(g,{error:"Your username must be at least one character"}))}fetch(`${c}/login`,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({createNew:e,server:"example.com",email:i.current.value,username:e?m.current.value:void 0,password:h(s.current.value)})}).then((e=>e.json())).then((t=>{if(e)return t.alreadyExists?void d.setActivePopover(a.createElement(g,{error:a.createElement(a.Fragment,null,"There's already an account with that email address, would you like to ",a.createElement("a",{href:"#",onClick:()=>d.setActivePopover(a.createElement(y,null))},"sign in")," instead?")})):void d.setActivePopover(a.createElement(v,{title:"Check your emails!"},"Thanks for joining us, you should get ",a.createElement("br",null)," an email in the next few minutes to ",a.createElement("br",null)," confirm the new account."));t.alreadyExists?t.passwordMatches?(localStorage.setItem("sessionID",t.sessionID),window.location="/chat"):d.setActivePopover(a.createElement(y,{error:"Incorrect password for this account"})):d.setActivePopover(a.createElement(y,{error:a.createElement(a.Fragment,null,"There's no account with that email address, would you like to ",a.createElement("a",{href:"#",onClick:()=>d.setActivePopover(a.createElement(g,null))},"create one"),"?")}))}))}function E({title:e,iconClickEvent:t,...n}){return a.createElement("header",n,a.createElement("img",{className:"avatar",onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-48x48.png"}),a.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"),0!=Object.keys(d.accountInformation).length&&a.createElement("button",{onClick:()=>{window.location="/chat"}},"Chat"),a.createElement("div",{style:{flexGrow:1}}),0!=Object.keys(d.accountInformation).length&&a.createElement("img",{className:"avatar",alt:"🐙",style:{cursor:"pointer"},src:c+d.accountInformation.avatar}))}function f({...e}){return[d.activePopover,d.setActivePopover]=a.useState(null),a.createElement("div",r({id:"popoverParent",style:{display:null==d.activePopover?"none":"flex"},onClick:()=>{d.setActivePopover(null)}},e),d.activePopover)}function v({children:e,title:t,style:n={},...l}){return a.createElement("div",r({id:"popover",style:{margin:n.margin?n.margin:"auto",...n},onClick:e=>{e.stopPropagation()}},l),a.createElement("div",{id:"popoverHeaderBar"},a.createElement("h3",null,t),a.createElement("div",{style:{flexGrow:1}}),a.createElement("button",{onClick:()=>{d.setActivePopover(null)},className:"material-symbols-outlined"},"close")),e)}function y({error:e=""}){return a.createElement(v,{title:"Sign In"},a.createElement("span",null,"Welcome back! If you don't already have an account ",a.createElement("br",null)," please ",a.createElement("a",{href:"#",onClick:()=>d.setActivePopover(a.createElement(g,null))},"create an account")," instead."),a.createElement("div",{id:"loginform"},a.createElement("em",{id:"signInErrorMessage"},e),a.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},a.createElement("label",null,"Email address "),a.createElement("input",{type:"email",id:"email",className:"textBox",ref:i}),a.createElement("label",null,"Password "),a.createElement("input",{type:"password",id:"password",className:"textBox",ref:s})),a.createElement("br",null),a.createElement("button",{onClick:()=>p(!1)},"Sign In")))}function g({error:e=""}){return a.createElement(v,{title:"Create Account"},a.createElement("span",null,"Welcome to Platypuss! If you already have an account ",a.createElement("br",null)," please ",a.createElement("a",{href:"#",onClick:()=>d.setActivePopover(a.createElement(y,null))},"sign in")," instead."),a.createElement("div",{id:"loginform"},e?a.createElement("em",{id:"signInErrorMessage"},e):"",a.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},a.createElement("label",null,"Email address "),a.createElement("input",{type:"email",id:"email",className:"textBox",ref:i}),a.createElement("label",null,"Username "),a.createElement("input",{type:"text",id:"unam",className:"textBox",ref:m}),a.createElement("label",null,"Password "),a.createElement("input",{type:"password",id:"password",className:"textBox",ref:s}),a.createElement("label",null,"Confirm Password "),a.createElement("input",{type:"password",id:"confirmPassword",className:"textBox",ref:u})),a.createElement("br",null),a.createElement("button",{onClick:()=>p(!0)},"Create Account")))}t.default=()=>{[d.accountInformation,d.setAccountInformation]=a.useState({}),a.useEffect((()=>{fetch(c+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>d.setAccountInformation(e))).catch((()=>{"/chat"==o.pathname&&(window.location="/")}))}),[]),i=a.useRef(null),s=a.useRef(null),m=a.useRef(null),u=a.useRef(null);let e="medium";return l&&localStorage.getItem("theme")&&(e=localStorage.getItem("theme")),[d.theme,d.setTheme]=a.useState(e),a.createElement(a.Fragment,null,a.createElement(E,{className:"light"==d.theme?"lightThemed":"darkThemed"}),a.createElement("main",{id:"mainPage",className:"dark"==d.theme?"darkThemed":"lightThemed"},a.createElement("h1",null,"You found the Platypuss public beta!"),a.createElement("p",null,"This website sees new changes to the Platypuss client before they're published. This means you get to try out new features and improvements before they make their way to the main site. Beware though, many of the changes you see here aren't tested and may break certain functionality. Should anything not work properly you're better off using the ",a.createElement("a",{href:"https://platypuss.net"},"stable version")," of the site."),0===Object.keys(d.accountInformation).length&&a.createElement("button",{onClick:()=>{d.setActivePopover(a.createElement(y,null))}},"Sign In"),0===Object.keys(d.accountInformation).length&&a.createElement("button",{onClick:()=>{d.setActivePopover(a.createElement(g,null))}},"Create Account")),a.createElement("footer",{className:"dark"==d.theme?"darkThemed":"lightThemed"},"links to stuff maybe"),a.createElement(f,{className:"light"==d.theme?"lightThemed":"darkThemed"}))};const w=()=>a.createElement("title",null,"(Beta!) Platypuss")}}]);
//# sourceMappingURL=component---src-pages-index-js-f5b9e0a92c9acff7ddc3.js.map