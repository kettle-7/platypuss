"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[293],{4852:function(e,t,a){a.d(t,{z:function(){return n}});var l=a(6540);const n=({title:e,iconClickEvent:t})=>l.createElement("header",null,l.createElement("img",{onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-48x48.png"}),l.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"))},2020:function(e,t,a){a.r(t),a.d(t,{Head:function(){return E}});var l=a(4852),n=a(6540);var r,i,s,c;function o(e,t=20){let a=3735928559^t,l=1103547991^t;for(let n,r=0;r<e.length;r++)n=e.charCodeAt(r),a=Math.imul(a^n,2654435761),l=Math.imul(l^n,1597334677);return a=Math.imul(a^a>>>16,2246822507)^Math.imul(l^l>>>13,3266489909),l=Math.imul(l^l>>>16,2246822507)^Math.imul(a^a>>>13,3266489909),(l>>>0).toString(16).padStart(8,0)+(a>>>0).toString(16).padStart(8,0)}var u=!1;const m={marginTop:0,marginBottom:64,maxWidth:320},p={marginBottom:48};function d(){fetch("https://platypuss.net/login",{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({createNew:u,ift:u,server:"example.com",ser:"example.com",email:r.current.value,pwd:o(s.current.value),password:o(s.current.value)})}).then((e=>e.json())).then((e=>{console.log(e),localStorage.setItem("sessionID",e.sessionID),window.location="/chat"}))}t.default=()=>(r=n.useRef(null),i=n.useRef(null),s=n.useRef(null),c=n.useRef(null),n.createElement(n.Fragment,null,n.createElement(l.z,null),n.createElement("main",{id:"mainPage"},n.createElement("a",{href:"/chat"},"cat"),n.createElement("h1",{style:m},"Congratulations",n.createElement("br",null),n.createElement("span",null,"— you just made a Skill iSsue site! 🎉🎉🎉 :3")),n.createElement("p",{style:p},"Edit ",n.createElement("code",null,"src/pages/index.js")," to see this page update in real-time. 😎"),n.createElement("div",{id:"P",className:"popupParent",style:{display:"flex"},onMouseDown:()=>{}},n.createElement("div",{id:"p",className:"popup"},n.createElement("h2",{id:"lit1"},"Sign In"),n.createElement("span",{id:"lit2"},"Welcome back! If you don't already have an account ",n.createElement("br",null)," please ",n.createElement("a",{href:"#",onClick:"su()"},"create an account")," instead."),n.createElement("div",{id:"loginform"},n.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},n.createElement("label",null,"Email address "),n.createElement("input",{type:"email",id:"email",className:"textBox",ref:r}),n.createElement("label",{id:"pr2"},"Username "),n.createElement("input",{type:"text",id:"unam",className:"textBox",ref:i}),n.createElement("label",null,"Password "),n.createElement("input",{type:"password",id:"pwd1",className:"textBox",ref:s}),n.createElement("label",{id:"pr1"},"Confirm Password "),n.createElement("input",{type:"password",id:"pwd2",className:"textBox",ref:c})),n.createElement("br",null),n.createElement("button",{onClick:d,id:"lit3"},"Sign In"))))),n.createElement("footer",null,"links to stuff maybe")));const E=()=>n.createElement("title",null,"(Beta!) Platypuss")}}]);
//# sourceMappingURL=component---src-pages-index-js-af72c56be5e150c26fc6.js.map