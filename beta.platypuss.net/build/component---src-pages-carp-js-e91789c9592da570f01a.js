"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[285],{3034:function(e,t,n){function o(e){let t=[],n="";for(let o=0;o<3;o++)t.push(Math.floor((e[o]-e[o]%16)/16).toString(16),Math.floor(e[o]%16).toString(16));for(let o=0;o<6;o++)n+=t[o];return n}function a(e,t){let n=[];for(let o=0;o<3;o++)n.push(e[o]*t);return n}function r(e,t,n=!1){let r=e=e.toLowerCase();for(let o=0;o<5&&"0"===r[0];o++)r=r.slice(1);if(6!==e.length||parseInt(e,16).toString(16)!==r)return!1;if(n)return!0;setTimeout((()=>{t.setThemeHex(e)}),50),localStorage.setItem("themeHex",e);let l=function(e){let t=parseInt(e,16),n=[],o=[];for(let a=0;a<6;a++)n.unshift(t%16),t=(t-t%16)/16;for(let a=0;a<6;a+=2)o.push(16*n[a]+n[a+1]);return o}(e),c=0;for(let o=0;o<3;o++)c+=l[o];let s="#"+e,i="#"+o(a(l,.75));return c>382.5?(document.body.style.setProperty("--foreground-level1","#000000"),document.body.style.setProperty("--foreground-level2","#222222"),document.body.style.setProperty("--accent","#b300ff")):(document.body.style.setProperty("--foreground-level1","#ffffff"),document.body.style.setProperty("--foreground-level2","#e0e0e0"),document.body.style.setProperty("--accent","#c847ff")),document.body.style.setProperty("--outgradient",s),document.body.style.setProperty("--ingradient",s),document.body.style.setProperty("--outgradientsmooth","linear-gradient("+s+", "+i+")"),document.body.style.setProperty("--ingradientsmooth","linear-gradient("+i+", "+s+")"),document.body.style.setProperty("--background-level1","#"+o(a(l,.82189542485))),document.body.style.setProperty("--background-level2","#"+o(a(l,.85751633988))),document.body.style.setProperty("--background-level3","#"+o(a(l,.89313725491))),document.body.style.setProperty("--background-level4","#"+o(a(l,.92875816994))),document.body.style.setProperty("--background-level5","#"+o(a(l,.96437908497))),document.body.style.setProperty("--background-level6",s),document.body.style.setProperty("--grey","#888888"),!0}n.d(t,{A:function(){return r}})},9073:function(e,t,n){n.r(t),n.d(t,{Head:function(){return g}});var o=n(3034),a=n(6540);function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r.apply(this,arguments)}var l="undefined"!=typeof window,c=l?new URL(window.location):new URL("http://localhost:8000");const s="https://platypuss.net";var i={};function u(){let e=a.useRef(null),t=a.useRef(null),n=a.useRef(null);return a.useEffect((()=>{n.current.innerText=i.accountInformation.aboutMe.text}),[i.accountInformation]),a.createElement(a.Fragment,null,a.createElement("div",{id:"profileBanner"},a.createElement("div",{className:"avatar",id:"changeAvatarHoverButton",onClick:()=>{let e=document.createElement("input");e.type="file",e.multiple=!1,e.accept="image/*",e.onchange=async function(e){let t=e.target.files[0];if(t.size>=1e7)return void i.setActivePopover(a.createElement(h,{title:"Woah, that's too big!"},"We only allow avatar sizes up to 10MB, this is to save storage space on the server. Please choose a smaller image or resize it in an image editor."));let n=new XMLHttpRequest;n.open("POST",`${s}/pfpUpload?id=${localStorage.getItem("sessionID")}`),n.onreadystatechange=()=>{n.readyState===XMLHttpRequest.DONE&&n.status?window.location.reload():console.log(n)},n.upload.onprogress=e=>{i.setAvatarProgress(e.loaded/e.total*100)},n.send(await t.bytes())},e.click()}},a.createElement("img",{className:"avatar",id:"changeAvatar",src:s+i.accountInformation.avatar}),a.createElement("span",{id:"changeAvatarText"},"Change")),a.createElement("h3",{id:"accountSettingsUsername",contentEditable:!0},i.accountInformation.username)," @",i.accountInformation.tag),a.createElement("h5",null,"Tell us a bit about you:"),a.createElement("div",{contentEditable:!0,id:"changeAboutMe",ref:n,onInput:()=>{fetch(`${s}/editAboutMe?id=${localStorage.getItem("sessionID")}`,{headers:{"Content-Type":"text/plain"},method:"POST",body:JSON.stringify({text:n.current.innerText})});let e={...i.accountInformation};e.aboutMe.text=n.current.innerText,i.setAccountInformation(e)}}),a.createElement("div",{style:{flexGrow:0,display:"flex",flexDirection:"row",gap:5,alignItems:"center"}},"Theme:",a.createElement("select",{defaultValue:i.theme},a.createElement("option",{value:"dark",onClick:()=>{setTimeout((()=>{i.setTheme("dark"),localStorage.setItem("theme","dark"),e.current.hidden=!0}),50)}},"Dark"),a.createElement("option",{value:"medium",onClick:()=>{setTimeout((()=>{i.setTheme("medium"),localStorage.setItem("theme","medium"),e.current.hidden=!0}),50)}},"Medium"),a.createElement("option",{value:"light",onClick:()=>{setTimeout((()=>{i.setTheme("light"),localStorage.setItem("theme","light"),e.current.hidden=!0}),50)}},"Light"),a.createElement("option",{value:"green",onClick:()=>{setTimeout((()=>{i.setTheme("green"),localStorage.setItem("theme","green"),e.current.hidden=!0}),50)}},"Greeeeeeeeeeeeeeeeeeeeeeeeeeen"),a.createElement("option",{value:"custom",onClick:()=>{setTimeout((()=>{i.setTheme("custom"),localStorage.setItem("theme","custom"),e.current.hidden=!1}),50)}},"Custom"))),a.createElement("span",{hidden:"custom"!==i.theme,ref:e},"Custom Theme Hex Colour: #",a.createElement("span",{id:"accountSettingsCustomTheme",contentEditable:!0,ref:t,onInput:()=>{(0,o.A)(t.current.innerText,i)}},i.themeHex)),a.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(a.createElement(h,{title:"Do you really want to delete your account?"},a.createElement("button",{onClick:()=>{fetch(s+"/deleteAccount?id="+localStorage.getItem("sessionID")).then((()=>{window.location="/"}))}},"Yes"),a.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(a.createElement(h,{title:"Account Settings"},a.createElement(u,null)))}),50)}},"No")))}),50)}},"Delete Account"),a.createElement("button",null,"Change Password"),a.createElement("button",{onClick:()=>{localStorage.setItem("sessionID",null),window.location="/"}},"Log Out"),a.createElement("button",{onClick:()=>{i.setActivePopover(null)}},"Done"))}function m({title:e,iconClickEvent:t,...n}){return a.useEffect((()=>{fetch(s+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>i.setAccountInformation(e))).catch((()=>{"/chat"===c.pathname&&(window.location="/")}))}),[]),a.createElement("header",n,a.createElement("img",{className:"avatar",onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-96x96.png"}),a.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"),a.createElement("div",{style:{flexGrow:1}}),a.createElement("img",{className:"avatar",style:{cursor:"pointer",display:Object.keys(i.accountInformation).length?"flex":"none"},src:s+i.accountInformation.avatar,onClick:()=>{i.setActivePopover(a.createElement(h,{title:"Account Settings"},a.createElement(u,null)))}}))}function d({...e}){return[i.activePopover,i.setActivePopover]=a.useState(null),a.createElement("div",r({id:"popoverParent",style:{display:"flex",height:null===i.activePopover?0:"100%"},onMouseDown:()=>{setTimeout((()=>{i.setActivePopover(null)}),50)}},e),i.activePopover||a.createElement(h,{style:{opacity:0}}))}function h({children:e,title:t,style:n={},...o}){let l=a.useRef(null);return a.createElement("div",r({id:"popover",style:{margin:n.margin?n.margin:"auto",...n},onClick:e=>{e.stopPropagation()},onMouseDown:e=>{e.stopPropagation()},className:i.activePopover?"slideUp":"",ref:l},o),t?a.createElement("div",{id:"popoverHeaderBar"},a.createElement("h3",null,t),a.createElement("div",{style:{flexGrow:1}}),a.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(null)}),50)},className:"material-symbols-outlined"},"close")):a.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(null)}),50)},style:{position:"absolute",top:5,right:5},className:"material-symbols-outlined"},"close"),e)}t.default=()=>{[i.accountInformation,i.setAccountInformation]=a.useState({}),a.useEffect((()=>{fetch(s+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>i.setAccountInformation(e))).catch((()=>{"/chat"===c.pathname&&(window.location="/")}))}),[]),a.useRef(null),a.useRef(null),a.useRef(null),a.useRef(null);let e="medium",t="000000";if(l&&!i.hasRendered)switch(t=localStorage.getItem("themeHex"),null==t&&(t="000000"),localStorage.getItem("theme")){case"custom":case"dark":case"light":case"green":case"medium":e=localStorage.getItem("theme")}return[i.theme,i.setTheme]=a.useState(e),[i.themeHex,i.setThemeHex]=a.useState(t),a.createElement(a.Fragment,null,a.createElement(m,{className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"light"===i.theme?"lightThemed":"darkThemed"}),a.createElement("main",{id:"mainPage",className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"dark"===i.theme?"darkThemed":"lightThemed"},a.createElement("img",{style:{flexShrink:1,overflow:"hidden",alignSelf:"stretch"},alt:"imagine a fish",src:"https://upload.wikimedia.org/wikipedia/commons/a/ac/Unsere_S%C3%BC%C3%9Fwasserfische_%28Tafel_33%29_%286102602781%29.jpg"})),a.createElement("footer",{className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"dark"===i.theme?"darkThemed":"lightThemed"},"do you like the new interim logo? if not then feel free to design your own and hit me up with a ",a.createElement("a",{href:"https://github.com/kettle-7/platypuss/issues/new"},"github issue")),a.createElement(d,{className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"dark"===i.theme?"darkThemed":"lightThemed"}))};const g=()=>a.createElement("title",null,"hehe faush >:3")}}]);
//# sourceMappingURL=component---src-pages-carp-js-e91789c9592da570f01a.js.map