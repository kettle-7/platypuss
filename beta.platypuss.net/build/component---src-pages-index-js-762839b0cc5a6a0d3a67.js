"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[293],{3034:function(e,t,n){function r(e){let t=[],n="";for(let r=0;r<3;r++)t.push(Math.floor((e[r]-e[r]%16)/16).toString(16),Math.floor(e[r]%16).toString(16));for(let r=0;r<6;r++)n+=t[r];return n}function l(e,t){let n=[];for(let r=0;r<3;r++)n.push(e[r]*t);return n}function a(e,t){let n=e=e.toLowerCase();for(let r=0;r<5&&"0"===n[0];r++)n=n.slice(1);if(6!==e.length||parseInt(e,16).toString(16)!==n)return;setTimeout((()=>{t.setThemeHex(e)}),50),localStorage.setItem("themeHex",e);let a=function(e){let t=parseInt(e,16),n=[],r=[];for(let l=0;l<6;l++)n.unshift(t%16),t=(t-t%16)/16;for(let l=0;l<6;l+=2)r.push(16*n[l]+n[l+1]);return r}(e),o=0;for(let r=0;r<3;r++)o+=a[r];let i="#"+e,c="#"+r(l(a,.75));o>382.5?(document.body.style.setProperty("--foreground-level1","#000000"),document.body.style.setProperty("--foreground-level2","#222222"),document.body.style.setProperty("--accent","#b300ff")):(document.body.style.setProperty("--foreground-level1","#ffffff"),document.body.style.setProperty("--foreground-level2","#e0e0e0"),document.body.style.setProperty("--accent","#c847ff")),document.body.style.setProperty("--outgradient",i),document.body.style.setProperty("--ingradient",i),document.body.style.setProperty("--outgradientsmooth","linear-gradient("+i+", "+c+")"),document.body.style.setProperty("--ingradientsmooth","linear-gradient("+c+", "+i+")"),document.body.style.setProperty("--background-level1","#"+r(l(a,.82189542485))),document.body.style.setProperty("--background-level2","#"+r(l(a,.85751633988))),document.body.style.setProperty("--background-level3","#"+r(l(a,.89313725491))),document.body.style.setProperty("--background-level4","#"+r(l(a,.92875816994))),document.body.style.setProperty("--background-level5","#"+r(l(a,.96437908497))),document.body.style.setProperty("--background-level6",i),document.body.style.setProperty("--grey","#888888")}n.d(t,{A:function(){return a}})},2020:function(e,t,n){n.r(t),n.d(t,{Head:function(){return x}});var r=n(3034),l=(n(6841),n(6540));function a(){return a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a.apply(null,arguments)}var o="undefined"!=typeof window,i=o?new URL(window.location):new URL("http://localhost:8000");const c="https://platypuss.net";var s,u,m,d,p={};function h(e,t=20){let n=3735928559^t,r=1103547991^t;for(let l,a=0;a<e.length;a++)l=e.charCodeAt(a),n=Math.imul(n^l,2654435761),r=Math.imul(r^l,1597334677);return n=Math.imul(n^n>>>16,2246822507)^Math.imul(r^r>>>13,3266489909),r=Math.imul(r^r>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),(r>>>0).toString(16).padStart(8,0)+(n>>>0).toString(16).padStart(8,0)}function f(e){if(e){if(u.current.value!==m.current.value)return void p.setActivePopover(l.createElement(E,{title:"Create Account"},l.createElement(b,{error:"Your passwords don't match"})));if(""===u.current.value.replace(/[\n\r\t ]/g,""))return void p.setActivePopover(l.createElement(E,{title:"Create Account"},l.createElement(b,{error:"Your password must be at least one character"})));if(""===d.current.value.replace(/[\n\r\t ]/g,""))return void p.setActivePopover(l.createElement(E,{title:"Create Account"},l.createElement(b,{error:"Your username must be at least one character"})))}fetch(`${c}/login`,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({createNew:e,server:"example.com",email:s.current.value,username:e?d.current.value:void 0,password:h(u.current.value)})}).then((e=>e.json())).then((t=>{if(e)return t.alreadyExists?void p.setActivePopover(l.createElement(E,{title:"Create Account"},l.createElement(b,{error:l.createElement(l.Fragment,null,"There's already an account with that email address, would you like to ",l.createElement("a",{href:"#",onClick:()=>p.setActivePopover(l.createElement(E,{title:"Sign In"},l.createElement(v,null)))},"sign in")," instead?")}))):void p.setActivePopover(l.createElement(E,{title:"Check your emails!"},"Thanks for joining us, you should get ",l.createElement("br",null)," an email in the next few minutes to ",l.createElement("br",null)," confirm the new account."));t.alreadyExists?t.passwordMatches?(localStorage.setItem("sessionID",t.sessionID),window.location="/chat"):p.setActivePopover(l.createElement(E,{title:"Sign In"},l.createElement(v,{error:"Incorrect password for this account"}))):p.setActivePopover(l.createElement(E,{title:"Sign In"},l.createElement(v,{error:l.createElement(l.Fragment,null,"There's no account with that email address, would you like to ",l.createElement("a",{href:"#",onClick:()=>p.setActivePopover(l.createElement(E,{title:"Create Account"},l.createElement(b,null)))},"create one"),"?")})))}))}function g(){let e=l.useRef(null),t=l.useRef(null),n=l.useRef(null);return l.useEffect((()=>{n.current.innerText=p.accountInformation.aboutMe.text}),[p.accountInformation]),l.createElement(E,{title:"Account Settings"},l.createElement("div",{id:"profileBanner"},l.createElement("div",{className:"avatar",id:"changeAvatarHoverButton",onClick:()=>{let e=document.createElement("input");e.type="file",e.multiple=!1,e.accept="image/*",e.onchange=async function(e){let t=e.target.files[0];if(t.size>=1e7)return void p.setActivePopover(l.createElement(E,{title:"Woah, that's too big!"},"We only allow avatar sizes up to 10MB, this is to save storage space on the server. Please choose a smaller image or resize it in an image editor."));let n=new XMLHttpRequest;n.open("POST",`${c}/pfpUpload?id=${localStorage.getItem("sessionID")}`),n.onreadystatechange=()=>{n.readyState===XMLHttpRequest.DONE&&n.status?window.location.reload():console.log(n)},n.upload.onprogress=e=>{p.setAvatarProgress(e.loaded/e.total*100)},n.send(await t.bytes())},e.click()}},l.createElement("img",{className:"avatar",id:"changeAvatar",src:c+p.accountInformation.avatar}),l.createElement("span",{id:"changeAvatarText"},"Change")),l.createElement("h3",{id:"accountSettingsUsername",contentEditable:!0},p.accountInformation.username)," @",p.accountInformation.tag),l.createElement("h5",null,"Tell us a bit about you:"),l.createElement("div",{contentEditable:!0,id:"changeAboutMe",ref:n,onInput:()=>{fetch(`${c}/editAboutMe?id=${localStorage.getItem("sessionID")}`,{headers:{"Content-Type":"text/plain"},method:"POST",body:JSON.stringify({text:n.current.innerText})});let e={...p.accountInformation};e.aboutMe.text=n.current.innerText,p.setAccountInformation(e)}}),l.createElement("div",{style:{flexGrow:0,display:"flex",flexDirection:"row",gap:5,alignItems:"center"}},"Theme:",l.createElement("select",{defaultValue:p.theme},l.createElement("option",{value:"dark",onClick:()=>{setTimeout((()=>{p.setTheme("dark"),localStorage.setItem("theme","dark"),e.current.hidden=!0}),50)}},"Dark"),l.createElement("option",{value:"medium",onClick:()=>{setTimeout((()=>{p.setTheme("medium"),localStorage.setItem("theme","medium"),e.current.hidden=!0}),50)}},"Medium"),l.createElement("option",{value:"light",onClick:()=>{setTimeout((()=>{p.setTheme("light"),localStorage.setItem("theme","light"),e.current.hidden=!0}),50)}},"Light"),l.createElement("option",{value:"green",onClick:()=>{setTimeout((()=>{p.setTheme("green"),localStorage.setItem("theme","green"),e.current.hidden=!0}),50)}},"Greeeeeeeeeeeeeeeeeeeeeeeeeeen"),l.createElement("option",{value:"custom",onClick:()=>{setTimeout((()=>{p.setTheme("custom"),localStorage.setItem("theme","custom"),e.current.hidden=!1}),50)}},"Custom"))),l.createElement("span",{hidden:"custom"!==p.theme,ref:e},"Custom Theme Hex Colour: #",l.createElement("span",{id:"accountSettingsCustomTheme",contentEditable:!0,ref:t,onInput:()=>{(0,r.A)(t.current.innerText,p)}},p.themeHex)),l.createElement("button",null,"Delete Account"),l.createElement("button",null,"Change Password"),l.createElement("button",{onClick:()=>{localStorage.setItem("sessionID",null),window.location="/"}},"Log Out"),l.createElement("button",{onClick:()=>{p.setActivePopover(null)}},"Done"))}function y({title:e,iconClickEvent:t,...n}){l.useRef(null),l.useRef(null);return l.useEffect((()=>{fetch(c+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>p.setAccountInformation(e))).catch((()=>{"/chat"===i.pathname&&(window.location="/")}))}),[]),l.createElement("header",n,l.createElement("img",{className:"avatar",onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-96x96.png"}),l.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"),l.createElement("div",{style:{flexGrow:1}}),l.createElement("img",{className:"avatar",style:{cursor:"pointer",display:Object.keys(p.accountInformation).length?"flex":"none"},src:c+p.accountInformation.avatar,onClick:()=>{p.setActivePopover(l.createElement(g,null))}}))}function k({...e}){return[p.activePopover,p.setActivePopover]=l.useState(null),l.createElement("div",a({id:"popoverParent",style:{display:"flex",height:null===p.activePopover?0:"100%"},onMouseDown:()=>{setTimeout((()=>{p.setActivePopover(null)}),50)}},e),p.activePopover||l.createElement(E,{style:{opacity:0}}))}function E({children:e,title:t,style:n={},...r}){let o=l.useRef(null);return l.createElement("div",a({id:"popover",style:{margin:n.margin?n.margin:"auto",...n},onClick:e=>{e.stopPropagation()},onMouseDown:e=>{e.stopPropagation()},className:p.activePopover?"slideUp":"",ref:o},r),t?l.createElement("div",{id:"popoverHeaderBar"},l.createElement("h3",null,t),l.createElement("div",{style:{flexGrow:1}}),l.createElement("button",{onClick:()=>{setTimeout((()=>{p.setActivePopover(null)}),50)},className:"material-symbols-outlined"},"close")):l.createElement("button",{onClick:()=>{setTimeout((()=>{p.setActivePopover(null)}),50)},style:{position:"absolute",top:5,right:5},className:"material-symbols-outlined"},"close"),e)}function v({error:e=""}){return l.createElement(l.Fragment,null,l.createElement("span",null,"Welcome back! If you don't already have an account please ",l.createElement("a",{href:"#",onClick:()=>p.setActivePopover(l.createElement(E,{title:"Create Account"},l.createElement(b,null)))},"create an account")," instead."),l.createElement("div",{id:"loginform"},l.createElement("em",{id:"signInErrorMessage"},e),l.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},l.createElement("label",null,"Email address "),l.createElement("input",{type:"email",id:"email",className:"textBox",ref:s}),l.createElement("label",null,"Password "),l.createElement("input",{type:"password",id:"password",className:"textBox",ref:u}))),l.createElement("button",{onClick:()=>f(!1)},"Sign In"))}function b({error:e=""}){return l.createElement(l.Fragment,null,l.createElement("span",null,"Welcome to Platypuss! If you already have an account please ",l.createElement("a",{href:"#",onClick:()=>p.setActivePopover(l.createElement(E,{title:"Sign In"},l.createElement(v,null)))},"sign in")," instead."),l.createElement("br",null),l.createElement("strong",null,"By using Platypuss you confirm that you have read and agreed to our ",l.createElement("a",{href:"/legal"},"legal agreements"),"."),l.createElement("div",{id:"loginform"},e?l.createElement("em",{id:"signInErrorMessage"},e):"",l.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},l.createElement("label",null,"Email address "),l.createElement("input",{type:"email",id:"email",className:"textBox",ref:s}),l.createElement("label",null,"Username "),l.createElement("input",{type:"text",id:"unam",className:"textBox",ref:d}),l.createElement("label",null,"Password "),l.createElement("input",{type:"password",id:"password",className:"textBox",ref:u}),l.createElement("label",null,"Confirm Password "),l.createElement("input",{type:"password",id:"confirmPassword",className:"textBox",ref:m}))),l.createElement("button",{onClick:()=>f(!0)},"Create Account"))}t.default=()=>{[p.accountInformation,p.setAccountInformation]=l.useState({}),l.useEffect((()=>{fetch(c+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>p.setAccountInformation(e))).catch((()=>{"/chat"===i.pathname&&(window.location="/")}))}),[]),s=l.useRef(null),u=l.useRef(null),d=l.useRef(null),m=l.useRef(null);let e="medium",t="000000";if(o&&!p.hasRendered)switch(t=localStorage.getItem("themeHex"),null==t&&(t="000000"),localStorage.getItem("theme")){case"custom":case"dark":case"light":case"green":case"medium":e=localStorage.getItem("theme")}return[p.theme,p.setTheme]=l.useState(e),[p.themeHex,p.setThemeHex]=l.useState(t),l.createElement(l.Fragment,null,l.createElement(y,{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"light"===p.theme?"lightThemed":"darkThemed"}),l.createElement("main",{id:"mainPage",className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"dark"===p.theme?"darkThemed":"lightThemed"},l.createElement("div",{style:{display:"flex",flexDirection:"row",gap:3}},0===Object.keys(p.accountInformation).length?l.createElement(l.Fragment,null,l.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{p.setActivePopover(l.createElement(E,{title:"Sign In"},l.createElement(v,null)))}},"Sign In"),l.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{p.setActivePopover(l.createElement(E,{title:"Create Account"},l.createElement(b,null)))}},"Create Account")):l.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{window.location="/chat"}},"Chat page")),l.createElement(l.Fragment,null,l.createElement("h1",null,"You found the Platypuss public beta!"),l.createElement("p",null,"This website sees new changes to the Platypuss client before they're published. This means you get to try out new features and improvements before they make their way to the main site. Beware though, many of the changes you see here aren't tested and may break certain functionality. Should anything not work properly you're better off using the ",l.createElement("a",{href:"https://platypuss.net"},"stable version")," of the site."))),l.createElement("footer",{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"dark"===p.theme?"darkThemed":"lightThemed"},"do you like the new interim logo? if not then feel free to design your own and hit me up with a ",l.createElement("a",{href:"https://github.com/kettle-7/platypuss/issues/new"},"github issue")),l.createElement(k,{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"light"===p.theme?"lightThemed":"darkThemed"}))};const x=()=>l.createElement(l.Fragment,null,l.createElement("title",null,"(Beta!) ","Platypuss"),l.createElement("link",{rel:"canonical",href:"https://beta.platypuss.net"}))},6841:function(e,t,n){var r=n(6540);function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}const a=["children","options"],o={blockQuote:"0",breakLine:"1",breakThematic:"2",codeBlock:"3",codeFenced:"4",codeInline:"5",footnote:"6",footnoteReference:"7",gfmTask:"8",heading:"9",headingSetext:"10",htmlBlock:"11",htmlComment:"12",htmlSelfClosing:"13",image:"14",link:"15",linkAngleBraceStyleDetector:"16",linkBareUrlDetector:"17",linkMailtoDetector:"18",newlineCoalescer:"19",orderedList:"20",paragraph:"21",ref:"22",refImage:"23",refLink:"24",table:"25",tableSeparator:"26",text:"27",textBolded:"28",textEmphasized:"29",textEscaped:"30",textMarked:"31",textStrikethroughed:"32",unorderedList:"33"};var i,c;(c=i||(i={}))[c.MAX=0]="MAX",c[c.HIGH=1]="HIGH",c[c.MED=2]="MED",c[c.LOW=3]="LOW",c[c.MIN=4]="MIN";const s=["allowFullScreen","allowTransparency","autoComplete","autoFocus","autoPlay","cellPadding","cellSpacing","charSet","className","classId","colSpan","contentEditable","contextMenu","crossOrigin","encType","formAction","formEncType","formMethod","formNoValidate","formTarget","frameBorder","hrefLang","inputMode","keyParams","keyType","marginHeight","marginWidth","maxLength","mediaGroup","minLength","noValidate","radioGroup","readOnly","rowSpan","spellCheck","srcDoc","srcLang","srcSet","tabIndex","useMap"].reduce(((e,t)=>(e[t.toLowerCase()]=t,e)),{for:"htmlFor"}),u={amp:"&",apos:"'",gt:">",lt:"<",nbsp:" ",quot:"“"},m=["style","script"],d=/([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi,p=/mailto:/i,h=/\n{2,}$/,f=/^(\s*>[\s\S]*?)(?=\n{2,})/,g=/^ *> ?/gm,y=/^ {2,}\n/,k=/^(?:( *[-*_])){3,} *(?:\n *)+\n/,E=/^\s*(`{3,}|~{3,}) *(\S+)?([^\n]*?)?\n([\s\S]+?)\s*\1 *(?:\n *)*\n?/,v=/^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/,b=/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,x=/^(?:\n *)*\n/,w=/\r\n?/g,S=/^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/,C=/^\[\^([^\]]+)]/,P=/\f/g,T=/^---[ \t]*\n(.|\n)*\n---[ \t]*\n/,I=/^\s*?\[(x|\s)\]/,A=/^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,M=/^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,$=/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/,R=/^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i,B=/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi,N=/^<!--[\s\S]*?(?:-->)/,O=/^(data|aria|x)-[a-z_][a-z\d_.-]*$/,z=/^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i,L=/^\{.*\}$/,D=/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,H=/^<([^ >]+@[^ >]+)>/,j=/^<([^ >]+:\/[^ >]+)>/,U=/-([a-z])?/gi,F=/^(.*\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/,W=/^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/,G=/^!\[([^\]]*)\] ?\[([^\]]*)\]/,_=/^\[([^\]]*)\] ?\[([^\]]*)\]/,q=/(\[|\])/g,X=/(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/,Y=/\t/g,Z=/(^ *\||\| *$)/g,V=/^ *:-+: *$/,J=/^ *:-+ *$/,Q=/^ *-+: *$/,K="((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~~.*?~~|==.*?==|.|\\n)*?)",ee=new RegExp(`^([*_])\\1${K}\\1\\1(?!\\1)`),te=new RegExp(`^([*_])${K}\\1(?!\\1|\\w)`),ne=new RegExp(`^==${K}==`),re=new RegExp(`^~~${K}~~`),le=/^\\([^0-9A-Za-z\s])/,ae=/^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&#;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i,oe=/^\n+/,ie=/^([ \t]*)/,ce=/\\([^\\])/g,se=/ *\n+$/,ue=/(?:^|\n)( *)$/,me="(?:\\d+\\.)",de="(?:[*+-])";function pe(e){return"( *)("+(1===e?me:de)+") +"}const he=pe(1),fe=pe(2);function ge(e){return new RegExp("^"+(1===e?he:fe))}const ye=ge(1),ke=ge(2);function Ee(e){return new RegExp("^"+(1===e?he:fe)+"[^\\n]*(?:\\n(?!\\1"+(1===e?me:de)+" )[^\\n]*)*(\\n|$)","gm")}const ve=Ee(1),be=Ee(2);function xe(e){const t=1===e?me:de;return new RegExp("^( *)("+t+") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1"+t+" (?!"+t+" ))\\n*|\\s*\\n*$)")}const we=xe(1),Se=xe(2);function Ce(e,t){const n=1===t,r=n?we:Se,l=n?ve:be,a=n?ye:ke;return{match(e,t,n){const l=ue.exec(n);return l&&(t.list||!t.inline&&!t.simple)?r.exec(e=l[1]+e):null},order:1,parse(e,t,r){const o=n?+e[2]:void 0,i=e[0].replace(h,"\n").match(l);let c=!1;return{items:i.map((function(e,n){const l=a.exec(e)[0].length,o=new RegExp("^ {1,"+l+"}","gm"),s=e.replace(o,"").replace(a,""),u=n===i.length-1,m=-1!==s.indexOf("\n\n")||u&&c;c=m;const d=r.inline,p=r.list;let h;r.list=!0,m?(r.inline=!1,h=s.replace(se,"\n\n")):(r.inline=!0,h=s.replace(se,""));const f=t(h,r);return r.inline=d,r.list=p,f})),ordered:n,start:o}},render:(t,n,r)=>e(t.ordered?"ol":"ul",{key:r.key,start:t.type===o.orderedList?t.start:void 0},t.items.map((function(t,l){return e("li",{key:l},n(t,r))})))}}const Pe=new RegExp("^\\[((?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*\\)"),Te=/^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/,Ie=[f,E,v,A,$,M,N,F,ve,we,be,Se],Ae=[...Ie,/^[^\n]+(?:  \n|\n{2,})/,R,z];function Me(e){return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g,"a").replace(/[çÇ]/g,"c").replace(/[ðÐ]/g,"d").replace(/[ÈÉÊËéèêë]/g,"e").replace(/[ÏïÎîÍíÌì]/g,"i").replace(/[Ññ]/g,"n").replace(/[øØœŒÕõÔôÓóÒò]/g,"o").replace(/[ÜüÛûÚúÙù]/g,"u").replace(/[ŸÿÝý]/g,"y").replace(/[^a-z0-9- ]/gi,"").replace(/ /gi,"-").toLowerCase()}function $e(e){return Q.test(e)?"right":V.test(e)?"center":J.test(e)?"left":null}function Re(e,t,n,r){const l=n.inTable;n.inTable=!0;let a=e.trim().split(/( *(?:`[^`]*`|<.*?>.*?<\/.*?>(?!<\/.*?>)|\\\||\|) *)/).reduce(((e,l)=>("|"===l.trim()?e.push(r?{type:o.tableSeparator}:{type:o.text,text:l}):""!==l&&e.push.apply(e,t(l,n)),e)),[]);n.inTable=l;let i=[[]];return a.forEach((function(e,t){e.type===o.tableSeparator?0!==t&&t!==a.length-1&&i.push([]):(e.type!==o.text||null!=a[t+1]&&a[t+1].type!==o.tableSeparator||(e.text=e.text.trimEnd()),i[i.length-1].push(e))})),i}function Be(e,t,n){n.inline=!0;const r=e[2]?e[2].replace(Z,"").split("|").map($e):[],l=e[3]?function(e,t,n){return e.trim().split("\n").map((function(e){return Re(e,t,n,!0)}))}(e[3],t,n):[],a=Re(e[1],t,n,!!l.length);return n.inline=!1,l.length?{align:r,cells:l,header:a,type:o.table}:{children:a,type:o.paragraph}}function Ne(e,t){return null==e.align[t]?{}:{textAlign:e.align[t]}}function Oe(e){return function(t,n){return n.inline?e.exec(t):null}}function ze(e){return function(t,n){return n.inline||n.simple?e.exec(t):null}}function Le(e){return function(t,n){return n.inline||n.simple?null:e.exec(t)}}function De(e){return function(t){return e.exec(t)}}function He(e,t,n){if(t.inline||t.simple)return null;if(n&&!n.endsWith("\n"))return null;let r="";e.split("\n").every((e=>!Ie.some((t=>t.test(e)))&&(r+=e+"\n",e.trim())));const l=r.trimEnd();return""==l?null:[r,l]}function je(e){try{if(decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g,"").match(/^\s*(javascript|vbscript|data(?!:image)):/i))return null}catch(e){return null}return e}function Ue(e){return e.replace(ce,"$1")}function Fe(e,t,n){const r=n.inline||!1,l=n.simple||!1;n.inline=!0,n.simple=!0;const a=e(t,n);return n.inline=r,n.simple=l,a}function We(e,t,n){const r=n.inline||!1,l=n.simple||!1;n.inline=!1,n.simple=!0;const a=e(t,n);return n.inline=r,n.simple=l,a}function Ge(e,t,n){const r=n.inline||!1;n.inline=!1;const l=e(t,n);return n.inline=r,l}const _e=(e,t,n)=>({children:Fe(t,e[1],n)});function qe(){return{}}function Xe(){return null}function Ye(...e){return e.filter(Boolean).join(" ")}function Ze(e,t,n){let r=e;const l=t.split(".");for(;l.length&&(r=r[l[0]],void 0!==r);)l.shift();return r||n}function Ve(e="",t={}){function n(e,n,...r){const a=Ze(t.overrides,`${e}.props`,{});return t.createElement(function(e,t){const n=Ze(t,e);return n?"function"==typeof n||"object"==typeof n&&"render"in n?n:Ze(t,`${e}.component`,e):e}(e,t.overrides),l({},n,a,{className:Ye(null==n?void 0:n.className,a.className)||void 0}),...r)}function a(e){e=e.replace(T,"");let l=!1;t.forceInline?l=!0:t.forceBlock||(l=!1===X.test(e));const a=J(V(l?e:`${e.trimEnd().replace(oe,"")}\n\n`,{inline:l}));for(;"string"==typeof a[a.length-1]&&!a[a.length-1].trim();)a.pop();if(null===t.wrapper)return a;const o=t.wrapper||(l?"span":"div");let i;if(a.length>1||t.forceWrapper)i=a;else{if(1===a.length)return i=a[0],"string"==typeof i?n("span",{key:"outer"},i):i;i=null}return r.createElement(o,{key:"outer"},i)}function i(e,n){const l=n.match(d);return l?l.reduce((function(n,l,o){const i=l.indexOf("=");if(-1!==i){const c=function(e){return-1!==e.indexOf("-")&&null===e.match(O)&&(e=e.replace(U,(function(e,t){return t.toUpperCase()}))),e}(l.slice(0,i)).trim(),u=function(e){const t=e[0];return('"'===t||"'"===t)&&e.length>=2&&e[e.length-1]===t?e.slice(1,-1):e}(l.slice(i+1).trim()),m=s[c]||c,d=n[m]=function(e,t,n,r){return"style"===t?n.split(/;\s?/).reduce((function(e,t){const n=t.slice(0,t.indexOf(":"));return e[n.trim().replace(/(-[a-z])/g,(e=>e[1].toUpperCase()))]=t.slice(n.length+1).trim(),e}),{}):"href"===t||"src"===t?r(n,e,t):(n.match(L)&&(n=n.slice(1,n.length-1)),"true"===n||"false"!==n&&n)}(e,c,u,t.sanitizer);"string"==typeof d&&(R.test(d)||z.test(d))&&(n[m]=r.cloneElement(a(d.trim()),{key:o}))}else"style"!==l&&(n[s[l]||l]=!0);return n}),{}):null}t.overrides=t.overrides||{},t.sanitizer=t.sanitizer||je,t.slugify=t.slugify||Me,t.namedCodesToUnicode=t.namedCodesToUnicode?l({},u,t.namedCodesToUnicode):u,t.createElement=t.createElement||r.createElement;const c=[],h={},Z={[o.blockQuote]:{match:Le(f),order:1,parse:(e,t,n)=>({children:t(e[0].replace(g,""),n)}),render:(e,t,r)=>n("blockquote",{key:r.key},t(e.children,r))},[o.breakLine]:{match:De(y),order:1,parse:qe,render:(e,t,r)=>n("br",{key:r.key})},[o.breakThematic]:{match:Le(k),order:1,parse:qe,render:(e,t,r)=>n("hr",{key:r.key})},[o.codeBlock]:{match:Le(v),order:0,parse:e=>({lang:void 0,text:e[0].replace(/^ {4}/gm,"").replace(/\n+$/,"")}),render:(e,t,r)=>n("pre",{key:r.key},n("code",l({},e.attrs,{className:e.lang?`lang-${e.lang}`:""}),e.text))},[o.codeFenced]:{match:Le(E),order:0,parse:e=>({attrs:i("code",e[3]||""),lang:e[2]||void 0,text:e[4],type:o.codeBlock})},[o.codeInline]:{match:ze(b),order:3,parse:e=>({text:e[2]}),render:(e,t,r)=>n("code",{key:r.key},e.text)},[o.footnote]:{match:Le(S),order:0,parse:e=>(c.push({footnote:e[2],identifier:e[1]}),{}),render:Xe},[o.footnoteReference]:{match:Oe(C),order:1,parse:e=>({target:`#${t.slugify(e[1],Me)}`,text:e[1]}),render:(e,r,l)=>n("a",{key:l.key,href:t.sanitizer(e.target,"a","href")},n("sup",{key:l.key},e.text))},[o.gfmTask]:{match:Oe(I),order:1,parse:e=>({completed:"x"===e[1].toLowerCase()}),render:(e,t,r)=>n("input",{checked:e.completed,key:r.key,readOnly:!0,type:"checkbox"})},[o.heading]:{match:Le(t.enforceAtxHeadings?M:A),order:1,parse:(e,n,r)=>({children:Fe(n,e[2],r),id:t.slugify(e[2],Me),level:e[1].length}),render:(e,t,r)=>n(`h${e.level}`,{id:e.id,key:r.key},t(e.children,r))},[o.headingSetext]:{match:Le($),order:0,parse:(e,t,n)=>({children:Fe(t,e[1],n),level:"="===e[2]?1:2,type:o.heading})},[o.htmlBlock]:{match:De(R),order:1,parse(e,t,n){const[,r]=e[3].match(ie),l=new RegExp(`^${r}`,"gm"),a=e[3].replace(l,""),o=(c=a,Ae.some((e=>e.test(c)))?Ge:Fe);var c;const s=e[1].toLowerCase(),u=-1!==m.indexOf(s),d=(u?s:e[1]).trim(),p={attrs:i(d,e[2]),noInnerParse:u,tag:d};return n.inAnchor=n.inAnchor||"a"===s,u?p.text=e[3]:p.children=o(t,a,n),n.inAnchor=!1,p},render:(e,t,r)=>n(e.tag,l({key:r.key},e.attrs),e.text||t(e.children,r))},[o.htmlSelfClosing]:{match:De(z),order:1,parse(e){const t=e[1].trim();return{attrs:i(t,e[2]||""),tag:t}},render:(e,t,r)=>n(e.tag,l({},e.attrs,{key:r.key}))},[o.htmlComment]:{match:De(N),order:1,parse:()=>({}),render:Xe},[o.image]:{match:ze(Te),order:1,parse:e=>({alt:e[1],target:Ue(e[2]),title:e[3]}),render:(e,r,l)=>n("img",{key:l.key,alt:e.alt||void 0,title:e.title||void 0,src:t.sanitizer(e.target,"img","src")})},[o.link]:{match:Oe(Pe),order:3,parse:(e,t,n)=>({children:We(t,e[1],n),target:Ue(e[2]),title:e[3]}),render:(e,r,l)=>n("a",{key:l.key,href:t.sanitizer(e.target,"a","href"),title:e.title},r(e.children,l))},[o.linkAngleBraceStyleDetector]:{match:Oe(j),order:0,parse:e=>({children:[{text:e[1],type:o.text}],target:e[1],type:o.link})},[o.linkBareUrlDetector]:{match:(e,t)=>t.inAnchor?null:Oe(D)(e,t),order:0,parse:e=>({children:[{text:e[1],type:o.text}],target:e[1],title:void 0,type:o.link})},[o.linkMailtoDetector]:{match:Oe(H),order:0,parse(e){let t=e[1],n=e[1];return p.test(n)||(n="mailto:"+n),{children:[{text:t.replace("mailto:",""),type:o.text}],target:n,type:o.link}}},[o.orderedList]:Ce(n,1),[o.unorderedList]:Ce(n,2),[o.newlineCoalescer]:{match:Le(x),order:3,parse:qe,render:()=>"\n"},[o.paragraph]:{match:He,order:3,parse:_e,render:(e,t,r)=>n("p",{key:r.key},t(e.children,r))},[o.ref]:{match:Oe(W),order:0,parse:e=>(h[e[1]]={target:e[2],title:e[4]},{}),render:Xe},[o.refImage]:{match:ze(G),order:0,parse:e=>({alt:e[1]||void 0,ref:e[2]}),render:(e,r,l)=>h[e.ref]?n("img",{key:l.key,alt:e.alt,src:t.sanitizer(h[e.ref].target,"img","src"),title:h[e.ref].title}):null},[o.refLink]:{match:Oe(_),order:0,parse:(e,t,n)=>({children:t(e[1],n),fallbackChildren:t(e[0].replace(q,"\\$1"),n),ref:e[2]}),render:(e,r,l)=>h[e.ref]?n("a",{key:l.key,href:t.sanitizer(h[e.ref].target,"a","href"),title:h[e.ref].title},r(e.children,l)):n("span",{key:l.key},r(e.fallbackChildren,l))},[o.table]:{match:Le(F),order:1,parse:Be,render(e,t,r){const l=e;return n("table",{key:r.key},n("thead",null,n("tr",null,l.header.map((function(e,a){return n("th",{key:a,style:Ne(l,a)},t(e,r))})))),n("tbody",null,l.cells.map((function(e,a){return n("tr",{key:a},e.map((function(e,a){return n("td",{key:a,style:Ne(l,a)},t(e,r))})))}))))}},[o.text]:{match:De(ae),order:4,parse:e=>({text:e[0].replace(B,((e,n)=>t.namedCodesToUnicode[n]?t.namedCodesToUnicode[n]:e))}),render:e=>e.text},[o.textBolded]:{match:ze(ee),order:2,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("strong",{key:r.key},t(e.children,r))},[o.textEmphasized]:{match:ze(te),order:3,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("em",{key:r.key},t(e.children,r))},[o.textEscaped]:{match:ze(le),order:1,parse:e=>({text:e[1],type:o.text})},[o.textMarked]:{match:ze(ne),order:3,parse:_e,render:(e,t,r)=>n("mark",{key:r.key},t(e.children,r))},[o.textStrikethroughed]:{match:ze(re),order:3,parse:_e,render:(e,t,r)=>n("del",{key:r.key},t(e.children,r))}};!0===t.disableParsingRawHTML&&(delete Z[o.htmlBlock],delete Z[o.htmlSelfClosing]);const V=function(e){let t=Object.keys(e);function n(r,l){let a=[],o="";for(;r;){let i=0;for(;i<t.length;){const c=t[i],s=e[c],u=s.match(r,l,o);if(u){const e=u[0];r=r.substring(e.length);const t=s.parse(u,n,l);null==t.type&&(t.type=c),a.push(t),o=e;break}i++}}return a}return t.sort((function(t,n){let r=e[t].order,l=e[n].order;return r!==l?r-l:t<n?-1:1})),function(e,t){return n(function(e){return e.replace(w,"\n").replace(P,"").replace(Y,"    ")}(e),t)}}(Z),J=(Q=function(e,t){return function(n,r,l){const a=e[n.type].render;return t?t((()=>a(n,r,l)),n,r,l):a(n,r,l)}}(Z,t.renderRule),function e(t,n={}){if(Array.isArray(t)){const r=n.key,l=[];let a=!1;for(let o=0;o<t.length;o++){n.key=o;const r=e(t[o],n),i="string"==typeof r;i&&a?l[l.length-1]+=r:null!==r&&l.push(r),a=i}return n.key=r,l}return Q(t,e,n)});var Q;const K=a(e);return c.length?n("div",null,K,n("footer",{key:"footer"},c.map((function(e){return n("div",{id:t.slugify(e.identifier,Me),key:e.identifier},e.identifier,J(V(e.footnote,{inline:!0})))})))):K}t.Ay=e=>{let{children:t="",options:n}=e,l=function(e,t){if(null==e)return{};var n,r,l={},a=Object.keys(e);for(r=0;r<a.length;r++)t.indexOf(n=a[r])>=0||(l[n]=e[n]);return l}(e,a);return r.cloneElement(Ve(t,n),l)}}}]);
//# sourceMappingURL=component---src-pages-index-js-762839b0cc5a6a0d3a67.js.map