"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[125],{3034:function(e,t,n){function o(e){let t=[],n="";for(let o=0;o<3;o++)t.push(Math.floor((e[o]-e[o]%16)/16).toString(16),Math.floor(e[o]%16).toString(16));for(let o=0;o<6;o++)n+=t[o];return n}function l(e,t){let n=[];for(let o=0;o<3;o++)n.push(e[o]*t);return n}function a(e,t){let n=e=e.toLowerCase();for(let o=0;o<5&&"0"===n[0];o++)n=n.slice(1);if(6!==e.length||parseInt(e,16).toString(16)!==n)return;setTimeout((()=>{t.setThemeHex(e)}),50),localStorage.setItem("themeHex",e);let a=function(e){let t=parseInt(e,16),n=[],o=[];for(let l=0;l<6;l++)n.unshift(t%16),t=(t-t%16)/16;for(let l=0;l<6;l+=2)o.push(16*n[l]+n[l+1]);return o}(e),r=0;for(let o=0;o<3;o++)r+=a[o];let c="#"+e,s="#"+o(l(a,.75));r>382.5?(document.body.style.setProperty("--foreground-level1","#000000"),document.body.style.setProperty("--foreground-level2","#222222"),document.body.style.setProperty("--accent","#b300ff")):(document.body.style.setProperty("--foreground-level1","#ffffff"),document.body.style.setProperty("--foreground-level2","#e0e0e0"),document.body.style.setProperty("--accent","#c847ff")),document.body.style.setProperty("--outgradient",c),document.body.style.setProperty("--ingradient",c),document.body.style.setProperty("--outgradientsmooth","linear-gradient("+c+", "+s+")"),document.body.style.setProperty("--ingradientsmooth","linear-gradient("+s+", "+c+")"),document.body.style.setProperty("--background-level1","#"+o(l(a,.82189542485))),document.body.style.setProperty("--background-level2","#"+o(l(a,.85751633988))),document.body.style.setProperty("--background-level3","#"+o(l(a,.89313725491))),document.body.style.setProperty("--background-level4","#"+o(l(a,.92875816994))),document.body.style.setProperty("--background-level5","#"+o(l(a,.96437908497))),document.body.style.setProperty("--background-level6",c),document.body.style.setProperty("--grey","#888888")}n.d(t,{A:function(){return a}})},3331:function(e,t,n){n.r(t),n.d(t,{Head:function(){return g}});var o=n(3034),l=n(6540);function a(){return a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)({}).hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},a.apply(null,arguments)}var r="undefined"!=typeof window,c=r?new URL(window.location):new URL("http://localhost:8000");const s="https://platypuss.net";var i={};function u(){let e=l.useRef(null),t=l.useRef(null),n=l.useRef(null);return l.useEffect((()=>{n.current.innerText=i.accountInformation.aboutMe.text}),[i.accountInformation]),l.createElement(l.Fragment,null,l.createElement("div",{id:"profileBanner"},l.createElement("div",{className:"avatar",id:"changeAvatarHoverButton",onClick:()=>{let e=document.createElement("input");e.type="file",e.multiple=!1,e.accept="image/*",e.onchange=async function(e){let t=e.target.files[0];if(t.size>=1e7)return void i.setActivePopover(l.createElement(h,{title:"Woah, that's too big!"},"We only allow avatar sizes up to 10MB, this is to save storage space on the server. Please choose a smaller image or resize it in an image editor."));let n=new XMLHttpRequest;n.open("POST",`${s}/pfpUpload?id=${localStorage.getItem("sessionID")}`),n.onreadystatechange=()=>{n.readyState===XMLHttpRequest.DONE&&n.status?window.location.reload():console.log(n)},n.upload.onprogress=e=>{i.setAvatarProgress(e.loaded/e.total*100)},n.send(await t.bytes())},e.click()}},l.createElement("img",{className:"avatar",id:"changeAvatar",src:s+i.accountInformation.avatar}),l.createElement("span",{id:"changeAvatarText"},"Change")),l.createElement("h3",{id:"accountSettingsUsername",contentEditable:!0},i.accountInformation.username)," @",i.accountInformation.tag),l.createElement("h5",null,"Tell us a bit about you:"),l.createElement("div",{contentEditable:!0,id:"changeAboutMe",ref:n,onInput:()=>{fetch(`${s}/editAboutMe?id=${localStorage.getItem("sessionID")}`,{headers:{"Content-Type":"text/plain"},method:"POST",body:JSON.stringify({text:n.current.innerText})});let e={...i.accountInformation};e.aboutMe.text=n.current.innerText,i.setAccountInformation(e)}}),l.createElement("div",{style:{flexGrow:0,display:"flex",flexDirection:"row",gap:5,alignItems:"center"}},"Theme:",l.createElement("select",{defaultValue:i.theme},l.createElement("option",{value:"dark",onClick:()=>{setTimeout((()=>{i.setTheme("dark"),localStorage.setItem("theme","dark"),e.current.hidden=!0}),50)}},"Dark"),l.createElement("option",{value:"medium",onClick:()=>{setTimeout((()=>{i.setTheme("medium"),localStorage.setItem("theme","medium"),e.current.hidden=!0}),50)}},"Medium"),l.createElement("option",{value:"light",onClick:()=>{setTimeout((()=>{i.setTheme("light"),localStorage.setItem("theme","light"),e.current.hidden=!0}),50)}},"Light"),l.createElement("option",{value:"green",onClick:()=>{setTimeout((()=>{i.setTheme("green"),localStorage.setItem("theme","green"),e.current.hidden=!0}),50)}},"Greeeeeeeeeeeeeeeeeeeeeeeeeeen"),l.createElement("option",{value:"custom",onClick:()=>{setTimeout((()=>{i.setTheme("custom"),localStorage.setItem("theme","custom"),e.current.hidden=!1}),50)}},"Custom"))),l.createElement("span",{hidden:"custom"!==i.theme,ref:e},"Custom Theme Hex Colour: #",l.createElement("span",{id:"accountSettingsCustomTheme",contentEditable:!0,ref:t,onInput:()=>{(0,o.A)(t.current.innerText,i)}},i.themeHex)),l.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(l.createElement(h,{title:"Do you really want to delete your account?"},l.createElement("button",{onClick:()=>{fetch(s+"/deleteAccount?id="+localStorage.getItem("sessionID")).then((()=>{window.location="/"}))}},"Yes"),l.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(l.createElement(h,{title:"Account Settings"},l.createElement(u,null)))}),50)}},"No")))}),50)}},"Delete Account"),l.createElement("button",null,"Change Password"),l.createElement("button",{onClick:()=>{localStorage.setItem("sessionID",null),window.location="/"}},"Log Out"),l.createElement("button",{onClick:()=>{i.setActivePopover(null)}},"Done"))}function m({title:e,iconClickEvent:t,...n}){return l.useEffect((()=>{fetch(s+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>i.setAccountInformation(e))).catch((()=>{"/chat"===c.pathname&&(window.location="/")}))}),[]),l.createElement("header",n,l.createElement("img",{className:"avatar",onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-96x96.png"}),l.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"Platypuss"),l.createElement("div",{style:{flexGrow:1}}),l.createElement("img",{className:"avatar",style:{cursor:"pointer",display:Object.keys(i.accountInformation).length?"flex":"none"},src:s+i.accountInformation.avatar,onClick:()=>{i.setActivePopover(l.createElement(h,{title:"Account Settings"},l.createElement(u,null)))}}))}function d({...e}){return[i.activePopover,i.setActivePopover]=l.useState(null),l.createElement("div",a({id:"popoverParent",style:{display:"flex",height:null===i.activePopover?0:"100%"},onMouseDown:()=>{setTimeout((()=>{i.setActivePopover(null)}),50)}},e),i.activePopover||l.createElement(h,{style:{opacity:0}}))}function h({children:e,title:t,style:n={},...o}){let r=l.useRef(null);return l.createElement("div",a({id:"popover",style:{margin:n.margin?n.margin:"auto",...n},onClick:e=>{e.stopPropagation()},onMouseDown:e=>{e.stopPropagation()},className:i.activePopover?"slideUp":"",ref:r},o),t?l.createElement("div",{id:"popoverHeaderBar"},l.createElement("h3",null,t),l.createElement("div",{style:{flexGrow:1}}),l.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(null)}),50)},className:"material-symbols-outlined"},"close")):l.createElement("button",{onClick:()=>{setTimeout((()=>{i.setActivePopover(null)}),50)},style:{position:"absolute",top:5,right:5},className:"material-symbols-outlined"},"close"),e)}t.default=()=>{[i.accountInformation,i.setAccountInformation]=l.useState({}),l.useEffect((()=>{fetch(s+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>i.setAccountInformation(e))).catch((()=>{"/chat"===c.pathname&&(window.location="/")}))}),[]),l.useRef(null),l.useRef(null),l.useRef(null),l.useRef(null);let e="medium",t="000000";if(r&&!i.hasRendered)switch(t=localStorage.getItem("themeHex"),null==t&&(t="000000"),localStorage.getItem("theme")){case"custom":case"dark":case"light":case"green":case"medium":e=localStorage.getItem("theme")}return[i.theme,i.setTheme]=l.useState(e),[i.themeHex,i.setThemeHex]=l.useState(t),l.createElement(l.Fragment,null,l.createElement(m,{className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"light"===i.theme?"lightThemed":"darkThemed"}),l.createElement("main",{id:"mainPage",className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"dark"===i.theme?"darkThemed":"lightThemed"},l.createElement("h2",null,"Error 404"),l.createElement("p",null,"This page does not exist. It may have been moved, deleted or eaten by a whale. If a link on the website took you here please contact whoever sent you the link and let them know."),l.createElement("a",{href:"/"},"Here's our homepage though if you're interested."),l.createElement("h6",null,"nothing here :3")),l.createElement("footer",{className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"dark"===i.theme?"darkThemed":"lightThemed"},"do you like the new interim logo? if not then feel free to design your own and hit me up with a ",l.createElement("a",{href:"https://github.com/kettle-7/platypuss/issues/new"},"github issue")),l.createElement(d,{className:"custom"===i.theme?"":"green"===i.theme?"greenThemed":"dark"===i.theme?"darkThemed":"lightThemed"}))};const g=()=>l.createElement("title",null,"Page not found | Platypuss")}}]);
//# sourceMappingURL=component---src-pages-404-js-e005bbc724d2247a83cd.js.map