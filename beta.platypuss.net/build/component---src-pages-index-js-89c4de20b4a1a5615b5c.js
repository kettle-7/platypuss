"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[293],{3034:function(e,t,n){function r(e){let t=[],n="";for(let r=0;r<3;r++)t.push(Math.floor((e[r]-e[r]%16)/16).toString(16),Math.floor(e[r]%16).toString(16));for(let r=0;r<6;r++)n+=t[r];return n}function a(e,t){let n=[];for(let r=0;r<3;r++)n.push(e[r]*t);return n}function l(e,t){let n=e=e.toLowerCase();for(let r=0;r<5&&"0"===n[0];r++)n=n.slice(1);if(6!==e.length||parseInt(e,16).toString(16)!==n)return;setTimeout((()=>{t.setThemeHex(e)}),50),localStorage.setItem("themeHex",e);let l=function(e){let t=parseInt(e,16),n=[],r=[];for(let a=0;a<6;a++)n.unshift(t%16),t=(t-t%16)/16;for(let a=0;a<6;a+=2)r.push(16*n[a]+n[a+1]);return r}(e),o=0;for(let r=0;r<3;r++)o+=l[r];let i="#"+e,c="#"+r(a(l,.75));o>382.5?(document.body.style.setProperty("--foreground-level1","#000000"),document.body.style.setProperty("--foreground-level2","#222222"),document.body.style.setProperty("--accent","#b300ff")):(document.body.style.setProperty("--foreground-level1","#ffffff"),document.body.style.setProperty("--foreground-level2","#e0e0e0"),document.body.style.setProperty("--accent","#c847ff")),document.body.style.setProperty("--outgradient",i),document.body.style.setProperty("--ingradient",i),document.body.style.setProperty("--outgradientsmooth","linear-gradient("+i+", "+c+")"),document.body.style.setProperty("--ingradientsmooth","linear-gradient("+c+", "+i+")"),document.body.style.setProperty("--background-level1","#"+r(a(l,.82189542485))),document.body.style.setProperty("--background-level2","#"+r(a(l,.85751633988))),document.body.style.setProperty("--background-level3","#"+r(a(l,.89313725491))),document.body.style.setProperty("--background-level4","#"+r(a(l,.92875816994))),document.body.style.setProperty("--background-level5","#"+r(a(l,.96437908497))),document.body.style.setProperty("--background-level6",i),document.body.style.setProperty("--grey","#888888")}n.d(t,{A:function(){return l}})},2020:function(e,t,n){n.r(t),n.d(t,{Head:function(){return b}});var r=n(3034),a=(n(6841),n(6540));function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}var o="undefined"!=typeof window,i=o?new URL(window.location):new URL("http://localhost:8000");const c="https://platypuss.net";var s,u,m,d,p={};function h(e,t=20){let n=3735928559^t,r=1103547991^t;for(let a,l=0;l<e.length;l++)a=e.charCodeAt(l),n=Math.imul(n^a,2654435761),r=Math.imul(r^a,1597334677);return n=Math.imul(n^n>>>16,2246822507)^Math.imul(r^r>>>13,3266489909),r=Math.imul(r^r>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),(r>>>0).toString(16).padStart(8,0)+(n>>>0).toString(16).padStart(8,0)}function f(e){if(e){if(u.current.value!==m.current.value)return void p.setActivePopover(a.createElement(E,{error:"Your passwords don't match"}));if(""===u.current.value.replace(/[\n\r\t ]/g,""))return void p.setActivePopover(a.createElement(E,{error:"Your password must be at least one character"}));if(""===d.current.value.replace(/[\n\r\t ]/g,""))return void p.setActivePopover(a.createElement(E,{error:"Your username must be at least one character"}))}fetch(`${c}/login`,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({createNew:e,server:"example.com",email:s.current.value,username:e?d.current.value:void 0,password:h(u.current.value)})}).then((e=>e.json())).then((t=>{if(e)return t.alreadyExists?void p.setActivePopover(a.createElement(E,{error:a.createElement(a.Fragment,null,"There's already an account with that email address, would you like to ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(v,null))},"sign in")," instead?")})):void p.setActivePopover(a.createElement(k,{title:"Check your emails!"},"Thanks for joining us, you should get ",a.createElement("br",null)," an email in the next few minutes to ",a.createElement("br",null)," confirm the new account."));t.alreadyExists?t.passwordMatches?(localStorage.setItem("sessionID",t.sessionID),window.location="/chat"):p.setActivePopover(a.createElement(v,{error:"Incorrect password for this account"})):p.setActivePopover(a.createElement(v,{error:a.createElement(a.Fragment,null,"There's no account with that email address, would you like to ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(E,null))},"create one"),"?")}))}))}function g({title:e,iconClickEvent:t,...n}){let l=a.useRef(null),o=a.useRef(null);return a.useEffect((()=>{fetch(c+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>p.setAccountInformation(e))).catch((()=>{"/chat"===i.pathname&&(window.location="/")}))}),[]),a.createElement("header",n,a.createElement("img",{className:"avatar",onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-96x96.png"}),a.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"),a.createElement("div",{style:{flexGrow:1}}),a.createElement("img",{className:"avatar",style:{cursor:"pointer"},src:c+p.accountInformation.avatar,onClick:()=>{p.setActivePopover(a.createElement(k,{title:"Account Settings"},a.createElement("div",{id:"profileBanner"},a.createElement("div",{className:"avatar",id:"changeAvatarHoverButton",onClick:()=>{let e=document.createElement("input");e.type="file",e.multiple=!1,e.accept="image/*",e.onchange=async function(e){let t=e.target.files[0];if(t.size>=1e7)return void p.setActivePopover(a.createElement(k,{title:"Woah, that's too big!"},"We only allow avatar sizes up to 10MB, this is to save storage space on the server. Please choose a smaller image or resize it in an image editor."));let n=new XMLHttpRequest;n.open("POST",`${c}/pfpUpload?id=${localStorage.getItem("sessionID")}`),n.onreadystatechange=()=>{n.readyState===XMLHttpRequest.DONE&&n.status?window.location.reload():console.log(n)},n.upload.onprogress=e=>{p.setAvatarProgress(e.loaded/e.total*100)},n.send(await t.bytes())},e.click()}},a.createElement("img",{className:"avatar",id:"changeAvatar",src:c+p.accountInformation.avatar}),a.createElement("span",{id:"changeAvatarText"},"Change")),a.createElement("h3",{id:"accountSettingsUsername",contentEditable:!0},p.accountInformation.username)," @",p.accountInformation.tag),a.createElement("h5",null,"Tell us a bit about you:"),a.createElement("div",{contentEditable:!0,id:"changeAboutMe"}),a.createElement("div",{style:{flexGrow:0,display:"flex",flexDirection:"row",gap:5,alignItems:"center"}},"Theme:",a.createElement("select",{defaultValue:p.theme},a.createElement("option",{value:"dark",onClick:()=>{setTimeout((()=>{p.setTheme("dark"),localStorage.setItem("theme","dark"),l.current.hidden=!0}),50)}},"Dark"),a.createElement("option",{value:"medium",onClick:()=>{setTimeout((()=>{p.setTheme("medium"),localStorage.setItem("theme","medium"),l.current.hidden=!0}),50)}},"Medium"),a.createElement("option",{value:"light",onClick:()=>{setTimeout((()=>{p.setTheme("light"),localStorage.setItem("theme","light"),l.current.hidden=!0}),50)}},"Light"),a.createElement("option",{value:"green",onClick:()=>{setTimeout((()=>{p.setTheme("green"),localStorage.setItem("theme","green"),l.current.hidden=!0}),50)}},"Greeeeeeeeeeeeeeeeeeeeeeeeeeen"),a.createElement("option",{value:"custom",onClick:()=>{setTimeout((()=>{p.setTheme("custom"),localStorage.setItem("theme","custom"),l.current.hidden=!1}),50)}},"Custom"))),a.createElement("span",{hidden:"custom"!==p.theme,ref:l},"Custom Theme Hex Colour: #",a.createElement("span",{id:"accountSettingsCustomTheme",contentEditable:!0,ref:o,onInput:()=>{(0,r.A)(o.current.innerText,p)}},p.themeHex)),a.createElement("button",null,"Delete Account"),a.createElement("button",null,"Change Password"),a.createElement("button",{onClick:()=>{localStorage.setItem("sessionID",null),window.location="/"}},"Log Out"),a.createElement("button",{onClick:()=>{p.setActivePopover(null)}},"Done")))}}))}function y({...e}){return[p.activePopover,p.setActivePopover]=a.useState(null),a.createElement("div",l({id:"popoverParent",style:{display:null==p.activePopover?"none":"flex"},onClick:()=>{p.setActivePopover(null)}},e),p.activePopover)}function k({children:e,title:t,style:n={},...r}){return a.createElement("div",l({id:"popover",style:{margin:n.margin?n.margin:"auto",...n},onClick:e=>{e.stopPropagation()}},r),a.createElement("div",{id:"popoverHeaderBar"},a.createElement("h3",null,t),a.createElement("div",{style:{flexGrow:1}}),a.createElement("button",{onClick:()=>{p.setActivePopover(null)},className:"material-symbols-outlined"},"close")),e)}function v({error:e=""}){return a.createElement(k,{title:"Sign In"},a.createElement("span",null,"Welcome back! If you don't already have an account please ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(E,null))},"create an account")," instead."),a.createElement("div",{id:"loginform"},a.createElement("em",{id:"signInErrorMessage"},e),a.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},a.createElement("label",null,"Email address "),a.createElement("input",{type:"email",id:"email",className:"textBox",ref:s}),a.createElement("label",null,"Password "),a.createElement("input",{type:"password",id:"password",className:"textBox",ref:u})),a.createElement("br",null),a.createElement("button",{onClick:()=>f(!1)},"Sign In")))}function E({error:e=""}){return a.createElement(k,{title:"Create Account"},a.createElement("span",null,"Welcome to Platypuss! If you already have an account please ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(v,null))},"sign in")," instead."),a.createElement("br",null),a.createElement("strong",null,"By using Platypuss you confirm that you have read and agreed to our ",a.createElement("a",{href:"/legal"},"legal agreements"),"."),a.createElement("div",{id:"loginform"},e?a.createElement("em",{id:"signInErrorMessage"},e):"",a.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},a.createElement("label",null,"Email address "),a.createElement("input",{type:"email",id:"email",className:"textBox",ref:s}),a.createElement("label",null,"Username "),a.createElement("input",{type:"text",id:"unam",className:"textBox",ref:d}),a.createElement("label",null,"Password "),a.createElement("input",{type:"password",id:"password",className:"textBox",ref:u}),a.createElement("label",null,"Confirm Password "),a.createElement("input",{type:"password",id:"confirmPassword",className:"textBox",ref:m})),a.createElement("br",null),a.createElement("button",{onClick:()=>f(!0)},"Create Account")))}t.default=()=>{[p.accountInformation,p.setAccountInformation]=a.useState({}),a.useEffect((()=>{fetch(c+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>p.setAccountInformation(e))).catch((()=>{"/chat"===i.pathname&&(window.location="/")}))}),[]),s=a.useRef(null),u=a.useRef(null),d=a.useRef(null),m=a.useRef(null);let e="medium",t="000000";if(o&&!p.hasRendered)switch(t=localStorage.getItem("themeHex"),null==t&&(t="000000"),localStorage.getItem("theme")){case"custom":case"dark":case"light":case"green":case"medium":e=localStorage.getItem("theme")}return[p.theme,p.setTheme]=a.useState(e),[p.themeHex,p.setThemeHex]=a.useState(t),a.createElement(a.Fragment,null,a.createElement(g,{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"light"===p.theme?"lightThemed":"darkThemed"}),a.createElement("main",{id:"mainPage",className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"dark"===p.theme?"darkThemed":"lightThemed"},0!==Object.keys(p.accountInformation).length&&a.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{window.location="/chat"}},"Chat"),0===Object.keys(p.accountInformation).length&&a.createElement(a.Fragment,null,a.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{p.setActivePopover(a.createElement(v,null))}},"Sign In"),a.createElement("br",null)),0===Object.keys(p.accountInformation).length&&a.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{p.setActivePopover(a.createElement(E,null))}},"Create Account"),a.createElement(a.Fragment,null,a.createElement("h1",null,"You found the Platypuss public beta!"),a.createElement("p",null,"This website sees new changes to the Platypuss client before they're published. This means you get to try out new features and improvements before they make their way to the main site. Beware though, many of the changes you see here aren't tested and may break certain functionality. Should anything not work properly you're better off using the ",a.createElement("a",{href:"https://platypuss.net"},"stable version")," of the site."))),a.createElement("footer",{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"dark"===p.theme?"darkThemed":"lightThemed"},"do you like the new interim logo? if not then feel free to design your own and hit me up with a ",a.createElement("a",{href:"https://github.com/kettle-7/platypuss/issues/new"},"github issue")),a.createElement(y,{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"light"===p.theme?"lightThemed":"darkThemed"}))};const b=()=>a.createElement("title",null,"(Beta!) ","Platypuss")},6841:function(e,t,n){var r=n(6540);function a(){return a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a.apply(this,arguments)}const l=["children","options"],o={blockQuote:"0",breakLine:"1",breakThematic:"2",codeBlock:"3",codeFenced:"4",codeInline:"5",footnote:"6",footnoteReference:"7",gfmTask:"8",heading:"9",headingSetext:"10",htmlBlock:"11",htmlComment:"12",htmlSelfClosing:"13",image:"14",link:"15",linkAngleBraceStyleDetector:"16",linkBareUrlDetector:"17",linkMailtoDetector:"18",newlineCoalescer:"19",orderedList:"20",paragraph:"21",ref:"22",refImage:"23",refLink:"24",table:"25",tableSeparator:"26",text:"27",textBolded:"28",textEmphasized:"29",textEscaped:"30",textMarked:"31",textStrikethroughed:"32",unorderedList:"33"};var i,c;(c=i||(i={}))[c.MAX=0]="MAX",c[c.HIGH=1]="HIGH",c[c.MED=2]="MED",c[c.LOW=3]="LOW",c[c.MIN=4]="MIN";const s=["allowFullScreen","allowTransparency","autoComplete","autoFocus","autoPlay","cellPadding","cellSpacing","charSet","className","classId","colSpan","contentEditable","contextMenu","crossOrigin","encType","formAction","formEncType","formMethod","formNoValidate","formTarget","frameBorder","hrefLang","inputMode","keyParams","keyType","marginHeight","marginWidth","maxLength","mediaGroup","minLength","noValidate","radioGroup","readOnly","rowSpan","spellCheck","srcDoc","srcLang","srcSet","tabIndex","useMap"].reduce(((e,t)=>(e[t.toLowerCase()]=t,e)),{for:"htmlFor"}),u={amp:"&",apos:"'",gt:">",lt:"<",nbsp:" ",quot:"“"},m=["style","script"],d=/([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi,p=/mailto:/i,h=/\n{2,}$/,f=/^(\s*>[\s\S]*?)(?=\n{2,})/,g=/^ *> ?/gm,y=/^ {2,}\n/,k=/^(?:( *[-*_])){3,} *(?:\n *)+\n/,v=/^\s*(`{3,}|~{3,}) *(\S+)?([^\n]*?)?\n([\s\S]+?)\s*\1 *(?:\n *)*\n?/,E=/^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/,b=/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,x=/^(?:\n *)*\n/,w=/\r\n?/g,S=/^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/,C=/^\[\^([^\]]+)]/,P=/\f/g,T=/^---[ \t]*\n(.|\n)*\n---[ \t]*\n/,I=/^\s*?\[(x|\s)\]/,A=/^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,M=/^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,$=/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/,B=/^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i,O=/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi,z=/^<!--[\s\S]*?(?:-->)/,L=/^(data|aria|x)-[a-z_][a-z\d_.-]*$/,N=/^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i,R=/^\{.*\}$/,D=/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,H=/^<([^ >]+@[^ >]+)>/,j=/^<([^ >]+:\/[^ >]+)>/,U=/-([a-z])?/gi,F=/^(.*\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/,W=/^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/,G=/^!\[([^\]]*)\] ?\[([^\]]*)\]/,_=/^\[([^\]]*)\] ?\[([^\]]*)\]/,q=/(\[|\])/g,X=/(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/,Y=/\t/g,Z=/(^ *\||\| *$)/g,V=/^ *:-+: *$/,Q=/^ *:-+ *$/,J=/^ *-+: *$/,K="((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~~.*?~~|==.*?==|.|\\n)*?)",ee=new RegExp(`^([*_])\\1${K}\\1\\1(?!\\1)`),te=new RegExp(`^([*_])${K}\\1(?!\\1|\\w)`),ne=new RegExp(`^==${K}==`),re=new RegExp(`^~~${K}~~`),ae=/^\\([^0-9A-Za-z\s])/,le=/^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&#;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i,oe=/^\n+/,ie=/^([ \t]*)/,ce=/\\([^\\])/g,se=/ *\n+$/,ue=/(?:^|\n)( *)$/,me="(?:\\d+\\.)",de="(?:[*+-])";function pe(e){return"( *)("+(1===e?me:de)+") +"}const he=pe(1),fe=pe(2);function ge(e){return new RegExp("^"+(1===e?he:fe))}const ye=ge(1),ke=ge(2);function ve(e){return new RegExp("^"+(1===e?he:fe)+"[^\\n]*(?:\\n(?!\\1"+(1===e?me:de)+" )[^\\n]*)*(\\n|$)","gm")}const Ee=ve(1),be=ve(2);function xe(e){const t=1===e?me:de;return new RegExp("^( *)("+t+") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1"+t+" (?!"+t+" ))\\n*|\\s*\\n*$)")}const we=xe(1),Se=xe(2);function Ce(e,t){const n=1===t,r=n?we:Se,a=n?Ee:be,l=n?ye:ke;return{match(e,t,n){const a=ue.exec(n);return a&&(t.list||!t.inline&&!t.simple)?r.exec(e=a[1]+e):null},order:1,parse(e,t,r){const o=n?+e[2]:void 0,i=e[0].replace(h,"\n").match(a);let c=!1;return{items:i.map((function(e,n){const a=l.exec(e)[0].length,o=new RegExp("^ {1,"+a+"}","gm"),s=e.replace(o,"").replace(l,""),u=n===i.length-1,m=-1!==s.indexOf("\n\n")||u&&c;c=m;const d=r.inline,p=r.list;let h;r.list=!0,m?(r.inline=!1,h=s.replace(se,"\n\n")):(r.inline=!0,h=s.replace(se,""));const f=t(h,r);return r.inline=d,r.list=p,f})),ordered:n,start:o}},render:(t,n,r)=>e(t.ordered?"ol":"ul",{key:r.key,start:t.type===o.orderedList?t.start:void 0},t.items.map((function(t,a){return e("li",{key:a},n(t,r))})))}}const Pe=new RegExp("^\\[((?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*\\)"),Te=/^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/,Ie=[f,v,E,A,$,M,z,F,Ee,we,be,Se],Ae=[...Ie,/^[^\n]+(?:  \n|\n{2,})/,B,N];function Me(e){return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g,"a").replace(/[çÇ]/g,"c").replace(/[ðÐ]/g,"d").replace(/[ÈÉÊËéèêë]/g,"e").replace(/[ÏïÎîÍíÌì]/g,"i").replace(/[Ññ]/g,"n").replace(/[øØœŒÕõÔôÓóÒò]/g,"o").replace(/[ÜüÛûÚúÙù]/g,"u").replace(/[ŸÿÝý]/g,"y").replace(/[^a-z0-9- ]/gi,"").replace(/ /gi,"-").toLowerCase()}function $e(e){return J.test(e)?"right":V.test(e)?"center":Q.test(e)?"left":null}function Be(e,t,n,r){const a=n.inTable;n.inTable=!0;let l=e.trim().split(/( *(?:`[^`]*`|<.*?>.*?<\/.*?>(?!<\/.*?>)|\\\||\|) *)/).reduce(((e,a)=>("|"===a.trim()?e.push(r?{type:o.tableSeparator}:{type:o.text,text:a}):""!==a&&e.push.apply(e,t(a,n)),e)),[]);n.inTable=a;let i=[[]];return l.forEach((function(e,t){e.type===o.tableSeparator?0!==t&&t!==l.length-1&&i.push([]):(e.type!==o.text||null!=l[t+1]&&l[t+1].type!==o.tableSeparator||(e.text=e.text.trimEnd()),i[i.length-1].push(e))})),i}function Oe(e,t,n){n.inline=!0;const r=e[2]?e[2].replace(Z,"").split("|").map($e):[],a=e[3]?function(e,t,n){return e.trim().split("\n").map((function(e){return Be(e,t,n,!0)}))}(e[3],t,n):[],l=Be(e[1],t,n,!!a.length);return n.inline=!1,a.length?{align:r,cells:a,header:l,type:o.table}:{children:l,type:o.paragraph}}function ze(e,t){return null==e.align[t]?{}:{textAlign:e.align[t]}}function Le(e){return function(t,n){return n.inline?e.exec(t):null}}function Ne(e){return function(t,n){return n.inline||n.simple?e.exec(t):null}}function Re(e){return function(t,n){return n.inline||n.simple?null:e.exec(t)}}function De(e){return function(t){return e.exec(t)}}function He(e,t,n){if(t.inline||t.simple)return null;if(n&&!n.endsWith("\n"))return null;let r="";e.split("\n").every((e=>!Ie.some((t=>t.test(e)))&&(r+=e+"\n",e.trim())));const a=r.trimEnd();return""==a?null:[r,a]}function je(e){try{if(decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g,"").match(/^\s*(javascript|vbscript|data(?!:image)):/i))return null}catch(e){return null}return e}function Ue(e){return e.replace(ce,"$1")}function Fe(e,t,n){const r=n.inline||!1,a=n.simple||!1;n.inline=!0,n.simple=!0;const l=e(t,n);return n.inline=r,n.simple=a,l}function We(e,t,n){const r=n.inline||!1,a=n.simple||!1;n.inline=!1,n.simple=!0;const l=e(t,n);return n.inline=r,n.simple=a,l}function Ge(e,t,n){const r=n.inline||!1;n.inline=!1;const a=e(t,n);return n.inline=r,a}const _e=(e,t,n)=>({children:Fe(t,e[1],n)});function qe(){return{}}function Xe(){return null}function Ye(...e){return e.filter(Boolean).join(" ")}function Ze(e,t,n){let r=e;const a=t.split(".");for(;a.length&&(r=r[a[0]],void 0!==r);)a.shift();return r||n}function Ve(e="",t={}){function n(e,n,...r){const l=Ze(t.overrides,`${e}.props`,{});return t.createElement(function(e,t){const n=Ze(t,e);return n?"function"==typeof n||"object"==typeof n&&"render"in n?n:Ze(t,`${e}.component`,e):e}(e,t.overrides),a({},n,l,{className:Ye(null==n?void 0:n.className,l.className)||void 0}),...r)}function l(e){e=e.replace(T,"");let a=!1;t.forceInline?a=!0:t.forceBlock||(a=!1===X.test(e));const l=Q(V(a?e:`${e.trimEnd().replace(oe,"")}\n\n`,{inline:a}));for(;"string"==typeof l[l.length-1]&&!l[l.length-1].trim();)l.pop();if(null===t.wrapper)return l;const o=t.wrapper||(a?"span":"div");let i;if(l.length>1||t.forceWrapper)i=l;else{if(1===l.length)return i=l[0],"string"==typeof i?n("span",{key:"outer"},i):i;i=null}return r.createElement(o,{key:"outer"},i)}function i(e,n){const a=n.match(d);return a?a.reduce((function(n,a,o){const i=a.indexOf("=");if(-1!==i){const c=function(e){return-1!==e.indexOf("-")&&null===e.match(L)&&(e=e.replace(U,(function(e,t){return t.toUpperCase()}))),e}(a.slice(0,i)).trim(),u=function(e){const t=e[0];return('"'===t||"'"===t)&&e.length>=2&&e[e.length-1]===t?e.slice(1,-1):e}(a.slice(i+1).trim()),m=s[c]||c,d=n[m]=function(e,t,n,r){return"style"===t?n.split(/;\s?/).reduce((function(e,t){const n=t.slice(0,t.indexOf(":"));return e[n.trim().replace(/(-[a-z])/g,(e=>e[1].toUpperCase()))]=t.slice(n.length+1).trim(),e}),{}):"href"===t||"src"===t?r(n,e,t):(n.match(R)&&(n=n.slice(1,n.length-1)),"true"===n||"false"!==n&&n)}(e,c,u,t.sanitizer);"string"==typeof d&&(B.test(d)||N.test(d))&&(n[m]=r.cloneElement(l(d.trim()),{key:o}))}else"style"!==a&&(n[s[a]||a]=!0);return n}),{}):null}t.overrides=t.overrides||{},t.sanitizer=t.sanitizer||je,t.slugify=t.slugify||Me,t.namedCodesToUnicode=t.namedCodesToUnicode?a({},u,t.namedCodesToUnicode):u,t.createElement=t.createElement||r.createElement;const c=[],h={},Z={[o.blockQuote]:{match:Re(f),order:1,parse:(e,t,n)=>({children:t(e[0].replace(g,""),n)}),render:(e,t,r)=>n("blockquote",{key:r.key},t(e.children,r))},[o.breakLine]:{match:De(y),order:1,parse:qe,render:(e,t,r)=>n("br",{key:r.key})},[o.breakThematic]:{match:Re(k),order:1,parse:qe,render:(e,t,r)=>n("hr",{key:r.key})},[o.codeBlock]:{match:Re(E),order:0,parse:e=>({lang:void 0,text:e[0].replace(/^ {4}/gm,"").replace(/\n+$/,"")}),render:(e,t,r)=>n("pre",{key:r.key},n("code",a({},e.attrs,{className:e.lang?`lang-${e.lang}`:""}),e.text))},[o.codeFenced]:{match:Re(v),order:0,parse:e=>({attrs:i("code",e[3]||""),lang:e[2]||void 0,text:e[4],type:o.codeBlock})},[o.codeInline]:{match:Ne(b),order:3,parse:e=>({text:e[2]}),render:(e,t,r)=>n("code",{key:r.key},e.text)},[o.footnote]:{match:Re(S),order:0,parse:e=>(c.push({footnote:e[2],identifier:e[1]}),{}),render:Xe},[o.footnoteReference]:{match:Le(C),order:1,parse:e=>({target:`#${t.slugify(e[1],Me)}`,text:e[1]}),render:(e,r,a)=>n("a",{key:a.key,href:t.sanitizer(e.target,"a","href")},n("sup",{key:a.key},e.text))},[o.gfmTask]:{match:Le(I),order:1,parse:e=>({completed:"x"===e[1].toLowerCase()}),render:(e,t,r)=>n("input",{checked:e.completed,key:r.key,readOnly:!0,type:"checkbox"})},[o.heading]:{match:Re(t.enforceAtxHeadings?M:A),order:1,parse:(e,n,r)=>({children:Fe(n,e[2],r),id:t.slugify(e[2],Me),level:e[1].length}),render:(e,t,r)=>n(`h${e.level}`,{id:e.id,key:r.key},t(e.children,r))},[o.headingSetext]:{match:Re($),order:0,parse:(e,t,n)=>({children:Fe(t,e[1],n),level:"="===e[2]?1:2,type:o.heading})},[o.htmlBlock]:{match:De(B),order:1,parse(e,t,n){const[,r]=e[3].match(ie),a=new RegExp(`^${r}`,"gm"),l=e[3].replace(a,""),o=(c=l,Ae.some((e=>e.test(c)))?Ge:Fe);var c;const s=e[1].toLowerCase(),u=-1!==m.indexOf(s),d=(u?s:e[1]).trim(),p={attrs:i(d,e[2]),noInnerParse:u,tag:d};return n.inAnchor=n.inAnchor||"a"===s,u?p.text=e[3]:p.children=o(t,l,n),n.inAnchor=!1,p},render:(e,t,r)=>n(e.tag,a({key:r.key},e.attrs),e.text||t(e.children,r))},[o.htmlSelfClosing]:{match:De(N),order:1,parse(e){const t=e[1].trim();return{attrs:i(t,e[2]||""),tag:t}},render:(e,t,r)=>n(e.tag,a({},e.attrs,{key:r.key}))},[o.htmlComment]:{match:De(z),order:1,parse:()=>({}),render:Xe},[o.image]:{match:Ne(Te),order:1,parse:e=>({alt:e[1],target:Ue(e[2]),title:e[3]}),render:(e,r,a)=>n("img",{key:a.key,alt:e.alt||void 0,title:e.title||void 0,src:t.sanitizer(e.target,"img","src")})},[o.link]:{match:Le(Pe),order:3,parse:(e,t,n)=>({children:We(t,e[1],n),target:Ue(e[2]),title:e[3]}),render:(e,r,a)=>n("a",{key:a.key,href:t.sanitizer(e.target,"a","href"),title:e.title},r(e.children,a))},[o.linkAngleBraceStyleDetector]:{match:Le(j),order:0,parse:e=>({children:[{text:e[1],type:o.text}],target:e[1],type:o.link})},[o.linkBareUrlDetector]:{match:(e,t)=>t.inAnchor?null:Le(D)(e,t),order:0,parse:e=>({children:[{text:e[1],type:o.text}],target:e[1],title:void 0,type:o.link})},[o.linkMailtoDetector]:{match:Le(H),order:0,parse(e){let t=e[1],n=e[1];return p.test(n)||(n="mailto:"+n),{children:[{text:t.replace("mailto:",""),type:o.text}],target:n,type:o.link}}},[o.orderedList]:Ce(n,1),[o.unorderedList]:Ce(n,2),[o.newlineCoalescer]:{match:Re(x),order:3,parse:qe,render:()=>"\n"},[o.paragraph]:{match:He,order:3,parse:_e,render:(e,t,r)=>n("p",{key:r.key},t(e.children,r))},[o.ref]:{match:Le(W),order:0,parse:e=>(h[e[1]]={target:e[2],title:e[4]},{}),render:Xe},[o.refImage]:{match:Ne(G),order:0,parse:e=>({alt:e[1]||void 0,ref:e[2]}),render:(e,r,a)=>h[e.ref]?n("img",{key:a.key,alt:e.alt,src:t.sanitizer(h[e.ref].target,"img","src"),title:h[e.ref].title}):null},[o.refLink]:{match:Le(_),order:0,parse:(e,t,n)=>({children:t(e[1],n),fallbackChildren:t(e[0].replace(q,"\\$1"),n),ref:e[2]}),render:(e,r,a)=>h[e.ref]?n("a",{key:a.key,href:t.sanitizer(h[e.ref].target,"a","href"),title:h[e.ref].title},r(e.children,a)):n("span",{key:a.key},r(e.fallbackChildren,a))},[o.table]:{match:Re(F),order:1,parse:Oe,render(e,t,r){const a=e;return n("table",{key:r.key},n("thead",null,n("tr",null,a.header.map((function(e,l){return n("th",{key:l,style:ze(a,l)},t(e,r))})))),n("tbody",null,a.cells.map((function(e,l){return n("tr",{key:l},e.map((function(e,l){return n("td",{key:l,style:ze(a,l)},t(e,r))})))}))))}},[o.text]:{match:De(le),order:4,parse:e=>({text:e[0].replace(O,((e,n)=>t.namedCodesToUnicode[n]?t.namedCodesToUnicode[n]:e))}),render:e=>e.text},[o.textBolded]:{match:Ne(ee),order:2,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("strong",{key:r.key},t(e.children,r))},[o.textEmphasized]:{match:Ne(te),order:3,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("em",{key:r.key},t(e.children,r))},[o.textEscaped]:{match:Ne(ae),order:1,parse:e=>({text:e[1],type:o.text})},[o.textMarked]:{match:Ne(ne),order:3,parse:_e,render:(e,t,r)=>n("mark",{key:r.key},t(e.children,r))},[o.textStrikethroughed]:{match:Ne(re),order:3,parse:_e,render:(e,t,r)=>n("del",{key:r.key},t(e.children,r))}};!0===t.disableParsingRawHTML&&(delete Z[o.htmlBlock],delete Z[o.htmlSelfClosing]);const V=function(e){let t=Object.keys(e);function n(r,a){let l=[],o="";for(;r;){let i=0;for(;i<t.length;){const c=t[i],s=e[c],u=s.match(r,a,o);if(u){const e=u[0];r=r.substring(e.length);const t=s.parse(u,n,a);null==t.type&&(t.type=c),l.push(t),o=e;break}i++}}return l}return t.sort((function(t,n){let r=e[t].order,a=e[n].order;return r!==a?r-a:t<n?-1:1})),function(e,t){return n(function(e){return e.replace(w,"\n").replace(P,"").replace(Y,"    ")}(e),t)}}(Z),Q=(J=function(e,t){return function(n,r,a){const l=e[n.type].render;return t?t((()=>l(n,r,a)),n,r,a):l(n,r,a)}}(Z,t.renderRule),function e(t,n={}){if(Array.isArray(t)){const r=n.key,a=[];let l=!1;for(let o=0;o<t.length;o++){n.key=o;const r=e(t[o],n),i="string"==typeof r;i&&l?a[a.length-1]+=r:null!==r&&a.push(r),l=i}return n.key=r,a}return J(t,e,n)});var J;const K=l(e);return c.length?n("div",null,K,n("footer",{key:"footer"},c.map((function(e){return n("div",{id:t.slugify(e.identifier,Me),key:e.identifier},e.identifier,Q(V(e.footnote,{inline:!0})))})))):K}t.Ay=e=>{let{children:t="",options:n}=e,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)t.indexOf(n=l[r])>=0||(a[n]=e[n]);return a}(e,l);return r.cloneElement(Ve(t,n),a)}}}]);
//# sourceMappingURL=component---src-pages-index-js-89c4de20b4a1a5615b5c.js.map