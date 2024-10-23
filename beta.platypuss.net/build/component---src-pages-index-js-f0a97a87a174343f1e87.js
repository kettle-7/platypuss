"use strict";(self.webpackChunkplatypuss_beta=self.webpackChunkplatypuss_beta||[]).push([[293],{3034:function(e,t,n){function r(e){let t=[],n="";for(let r=0;r<3;r++)t.push(Math.floor((e[r]-e[r]%16)/16).toString(16),Math.floor(e[r]%16).toString(16));for(let r=0;r<6;r++)n+=t[r];return n}function a(e,t){let n=[];for(let r=0;r<3;r++)n.push(e[r]*t);return n}function o(e,t){let n=e=e.toLowerCase();for(let r=0;r<5&&"0"===n[0];r++)n=n.slice(1);if(6!==e.length||parseInt(e,16).toString(16)!==n)return;setTimeout((()=>{t.setThemeHex(e)}),50),localStorage.setItem("themeHex",e);let o=function(e){let t=parseInt(e,16),n=[],r=[];for(let a=0;a<6;a++)n.unshift(t%16),t=(t-t%16)/16;for(let a=0;a<6;a+=2)r.push(16*n[a]+n[a+1]);return r}(e),l=0;for(let r=0;r<3;r++)l+=o[r];let c="#"+e,i="#"+r(a(o,.75));l>382.5?(document.body.style.setProperty("--foreground-level1","#000000"),document.body.style.setProperty("--foreground-level2","#222222"),document.body.style.setProperty("--accent","#b300ff")):(document.body.style.setProperty("--foreground-level1","#ffffff"),document.body.style.setProperty("--foreground-level2","#e0e0e0"),document.body.style.setProperty("--accent","#c847ff")),document.body.style.setProperty("--outgradient",c),document.body.style.setProperty("--ingradient",c),document.body.style.setProperty("--outgradientsmooth","linear-gradient("+c+", "+i+")"),document.body.style.setProperty("--ingradientsmooth","linear-gradient("+i+", "+c+")"),document.body.style.setProperty("--background-level1","#"+r(a(o,.82189542485))),document.body.style.setProperty("--background-level2","#"+r(a(o,.85751633988))),document.body.style.setProperty("--background-level3","#"+r(a(o,.89313725491))),document.body.style.setProperty("--background-level4","#"+r(a(o,.92875816994))),document.body.style.setProperty("--background-level5","#"+r(a(o,.96437908497))),document.body.style.setProperty("--background-level6",c),document.body.style.setProperty("--grey","#888888")}n.d(t,{A:function(){return o}})},2020:function(e,t,n){n.r(t),n.d(t,{Head:function(){return x}});var r=n(3034),a=(n(6841),n(6540));function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o.apply(this,arguments)}var l="undefined"!=typeof window,c=l?new URL(window.location):new URL("http://localhost:8000");const i="https://platypuss.net";var s,u,m,d,p={};function h(e,t=20){let n=3735928559^t,r=1103547991^t;for(let a,o=0;o<e.length;o++)a=e.charCodeAt(o),n=Math.imul(n^a,2654435761),r=Math.imul(r^a,1597334677);return n=Math.imul(n^n>>>16,2246822507)^Math.imul(r^r>>>13,3266489909),r=Math.imul(r^r>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),(r>>>0).toString(16).padStart(8,0)+(n>>>0).toString(16).padStart(8,0)}function f(e){if(e){if(u.current.value!==m.current.value)return void p.setActivePopover(a.createElement(k,{title:"Create Account"},a.createElement(b,{error:"Your passwords don't match"})));if(""===u.current.value.replace(/[\n\r\t ]/g,""))return void p.setActivePopover(a.createElement(k,{title:"Create Account"},a.createElement(b,{error:"Your password must be at least one character"})));if(""===d.current.value.replace(/[\n\r\t ]/g,""))return void p.setActivePopover(a.createElement(k,{title:"Create Account"},a.createElement(b,{error:"Your username must be at least one character"})))}fetch(`${i}/login`,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({createNew:e,server:"example.com",email:s.current.value,username:d.current?d.current.value:void 0,password:h(u.current.value)})}).then((e=>e.json())).then((t=>{if(e)return t.alreadyExists?void p.setActivePopover(a.createElement(k,{title:"Create Account"},a.createElement(b,{error:a.createElement(a.Fragment,null,"There's already an account with that email address, would you like to ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(k,{title:"Sign In"},a.createElement(v,null)))},"sign in")," instead?")}))):void p.setActivePopover(a.createElement(k,{title:"Check your emails!"},"Thanks for joining us, you should get ",a.createElement("br",null)," an email in the next few minutes to ",a.createElement("br",null)," confirm the new account."));t.alreadyExists?t.passwordMatches?(localStorage.setItem("sessionID",t.sessionID),window.location="/chat"):p.setActivePopover(a.createElement(k,{title:"Sign In"},a.createElement(v,{error:"Incorrect password for this account"}))):p.setActivePopover(a.createElement(k,{title:"Sign In"},a.createElement(v,{error:a.createElement(a.Fragment,null,"There's no account with that email address, would you like to ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(k,{title:"Create Account"},a.createElement(b,null)))},"create one"),"?")})))}))}function g(){let e=a.useRef(null),t=a.useRef(null),n=a.useRef(null);return a.useEffect((()=>{n.current.innerText=p.accountInformation.aboutMe.text}),[p.accountInformation]),a.createElement(a.Fragment,null,a.createElement("div",{id:"profileBanner"},a.createElement("div",{className:"avatar",id:"changeAvatarHoverButton",onClick:()=>{let e=document.createElement("input");e.type="file",e.multiple=!1,e.accept="image/*",e.onchange=async function(e){let t=e.target.files[0];if(t.size>=1e7)return void p.setActivePopover(a.createElement(k,{title:"Woah, that's too big!"},"We only allow avatar sizes up to 10MB, this is to save storage space on the server. Please choose a smaller image or resize it in an image editor."));let n=new XMLHttpRequest;n.open("POST",`${i}/pfpUpload?id=${localStorage.getItem("sessionID")}`),n.onreadystatechange=()=>{n.readyState===XMLHttpRequest.DONE&&n.status?window.location.reload():console.log(n)},n.upload.onprogress=e=>{p.setAvatarProgress(e.loaded/e.total*100)},n.send(await t.bytes())},e.click()}},a.createElement("img",{className:"avatar",id:"changeAvatar",src:i+p.accountInformation.avatar}),a.createElement("span",{id:"changeAvatarText"},"Change")),a.createElement("h3",{id:"accountSettingsUsername",contentEditable:!0},p.accountInformation.username)," @",p.accountInformation.tag),a.createElement("h5",null,"Tell us a bit about you:"),a.createElement("div",{contentEditable:!0,id:"changeAboutMe",ref:n,onInput:()=>{fetch(`${i}/editAboutMe?id=${localStorage.getItem("sessionID")}`,{headers:{"Content-Type":"text/plain"},method:"POST",body:JSON.stringify({text:n.current.innerText})});let e={...p.accountInformation};e.aboutMe.text=n.current.innerText,p.setAccountInformation(e)}}),a.createElement("div",{style:{flexGrow:0,display:"flex",flexDirection:"row",gap:5,alignItems:"center"}},"Theme:",a.createElement("select",{defaultValue:p.theme},a.createElement("option",{value:"dark",onClick:()=>{setTimeout((()=>{p.setTheme("dark"),localStorage.setItem("theme","dark"),e.current.hidden=!0}),50)}},"Dark"),a.createElement("option",{value:"medium",onClick:()=>{setTimeout((()=>{p.setTheme("medium"),localStorage.setItem("theme","medium"),e.current.hidden=!0}),50)}},"Medium"),a.createElement("option",{value:"light",onClick:()=>{setTimeout((()=>{p.setTheme("light"),localStorage.setItem("theme","light"),e.current.hidden=!0}),50)}},"Light"),a.createElement("option",{value:"green",onClick:()=>{setTimeout((()=>{p.setTheme("green"),localStorage.setItem("theme","green"),e.current.hidden=!0}),50)}},"Greeeeeeeeeeeeeeeeeeeeeeeeeeen"),a.createElement("option",{value:"custom",onClick:()=>{setTimeout((()=>{p.setTheme("custom"),localStorage.setItem("theme","custom"),e.current.hidden=!1}),50)}},"Custom"))),a.createElement("span",{hidden:"custom"!==p.theme,ref:e},"Custom Theme Hex Colour: #",a.createElement("span",{id:"accountSettingsCustomTheme",contentEditable:!0,ref:t,onInput:()=>{(0,r.A)(t.current.innerText,p)}},p.themeHex)),a.createElement("button",{onClick:()=>{setTimeout((()=>{p.setActivePopover(a.createElement(k,{title:"Do you really want to delete your account?"},a.createElement("button",{onClick:()=>{fetch(i+"/deleteAccount?id="+localStorage.getItem("sessionID")).then((()=>{window.location="/"}))}},"Yes"),a.createElement("button",{onClick:()=>{setTimeout((()=>{p.setActivePopover(a.createElement(k,{title:"Account Settings"},a.createElement(g,null)))}),50)}},"No")))}),50)}},"Delete Account"),a.createElement("button",{onClick:()=>{setTimeout((()=>{p.setActivePopover(a.createElement(k,{title:"Change Password"},a.createElement("input",{id:"password",type:"text",placeholder:"New Password"}),a.createElement("input",{id:"confirmPassword",type:"text",placeholder:"Confirm Password"}),a.createElement("button",{onClick:()=>{fetch(i+"/changePassword?id="+localStorage.getItem("sessionID")+"&newPassword="+h(document.getElementById("password").value)).then(window.location.reload)}},"do the thing")))}),50)}},"Change Password"),a.createElement("button",{onClick:()=>{localStorage.setItem("sessionID",null),window.location="/"}},"Log Out"),a.createElement("button",{onClick:()=>{p.setActivePopover(null)}},"Done"))}function y({title:e,iconClickEvent:t,...n}){return a.useEffect((()=>{fetch(i+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>p.setAccountInformation(e))).catch((()=>{"/chat"===c.pathname&&(window.location="/")}))}),[]),a.createElement("header",n,a.createElement("img",{className:"avatar",onClick:t||(()=>{window.location="/"}),style:{cursor:"pointer"},src:"/icons/icon-96x96.png"}),a.createElement("h2",{onClick:()=>{window.location="/"},style:{cursor:"pointer"}},e||"(Beta!) Platypuss"),a.createElement("div",{style:{flexGrow:1}}),a.createElement("img",{className:"avatar",style:{cursor:"pointer",display:Object.keys(p.accountInformation).length?"flex":"none"},src:i+p.accountInformation.avatar,onClick:()=>{p.setActivePopover(a.createElement(k,{title:"Account Settings"},a.createElement(g,null)))}}))}function E({...e}){return[p.activePopover,p.setActivePopover]=a.useState(null),a.createElement("div",o({id:"popoverParent",style:{display:"flex",height:null===p.activePopover?0:"100%"},onMouseDown:()=>{setTimeout((()=>{p.setActivePopover(null)}),50)}},e),p.activePopover||a.createElement(k,{style:{opacity:0}}))}function k({children:e,title:t,style:n={},...r}){let l=a.useRef(null);return a.createElement("div",o({id:"popover",style:{margin:n.margin?n.margin:"auto",...n},onClick:e=>{e.stopPropagation()},onMouseDown:e=>{e.stopPropagation()},className:p.activePopover?"slideUp":"",ref:l},r),t?a.createElement("div",{id:"popoverHeaderBar"},a.createElement("h3",null,t),a.createElement("div",{style:{flexGrow:1}}),a.createElement("button",{onClick:()=>{setTimeout((()=>{p.setActivePopover(null)}),50)},className:"material-symbols-outlined"},"close")):a.createElement("button",{onClick:()=>{setTimeout((()=>{p.setActivePopover(null)}),50)},style:{position:"absolute",top:5,right:5},className:"material-symbols-outlined"},"close"),e)}function v({error:e=""}){return a.createElement(a.Fragment,null,a.createElement("span",null,"Welcome back! If you don't already have an account please ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(k,{title:"Create Account"},a.createElement(b,null)))},"create an account")," instead."),a.createElement("p",null,"temporary notice: i accidentally removed everyone's emails so if you haven't already then please put in your username as well as your email so i can tie it back to your account. thanks for all your patience!"),a.createElement("div",{id:"loginform"},a.createElement("em",{id:"signInErrorMessage"},e),a.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},a.createElement("label",null,"Email address "),a.createElement("input",{type:"email",id:"email",className:"textBox",ref:s}),a.createElement("label",null,"Username "),a.createElement("input",{type:"text",id:"username",className:"textBox",ref:d}),a.createElement("label",null,"Password "),a.createElement("input",{type:"password",id:"password",className:"textBox",ref:u}))),a.createElement("button",{className:"roomMention",onClick:()=>{fetch(i+"/requestAccountRecovery?accountEmailAddress="+s.current.value).then((e=>e.text())).then((e=>p.setActivePopover(a.createElement(k,{title:"Account Recovery"},e))))}},"a plz help i forgor me passworde"),a.createElement("button",{onClick:()=>f(!1)},"Sign In"))}function b({error:e=""}){return a.createElement(a.Fragment,null,a.createElement("span",null,"Welcome to Platypuss! If you already have an account please ",a.createElement("a",{href:"#",onClick:()=>p.setActivePopover(a.createElement(k,{title:"Sign In"},a.createElement(v,null)))},"sign in")," instead."),a.createElement("br",null),a.createElement("strong",null,"By using Platypuss you confirm that you have read and agreed to our ",a.createElement("a",{href:"/legal"},"legal agreements"),"."),a.createElement("div",{id:"loginform"},e?a.createElement("em",{id:"signInErrorMessage"},e):"",a.createElement("div",{style:{display:"grid",gridTemplateColumns:"auto auto"}},a.createElement("label",null,"Email address "),a.createElement("input",{type:"email",id:"email",className:"textBox",ref:s}),a.createElement("label",null,"Username "),a.createElement("input",{type:"text",id:"unam",className:"textBox",ref:d}),a.createElement("label",null,"Password "),a.createElement("input",{type:"password",id:"password",className:"textBox",ref:u}),a.createElement("label",null,"Confirm Password "),a.createElement("input",{type:"password",id:"confirmPassword",className:"textBox",ref:m}))),a.createElement("button",{onClick:()=>f(!0)},"Create Account"))}t.default=()=>{[p.accountInformation,p.setAccountInformation]=a.useState({}),a.useEffect((()=>{fetch(i+"/uinfo?id="+localStorage.getItem("sessionID")).then((e=>e.json())).then((e=>p.setAccountInformation(e))).catch((()=>{"/chat"===c.pathname&&(window.location="/")}))}),[]),s=a.useRef(null),u=a.useRef(null),d=a.useRef(null),m=a.useRef(null);let e="medium",t="000000";if(l&&!p.hasRendered)switch(t=localStorage.getItem("themeHex"),null==t&&(t="000000"),localStorage.getItem("theme")){case"custom":case"dark":case"light":case"green":case"medium":e=localStorage.getItem("theme")}return[p.theme,p.setTheme]=a.useState(e),[p.themeHex,p.setThemeHex]=a.useState(t),a.createElement(a.Fragment,null,a.createElement(y,{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"light"===p.theme?"lightThemed":"darkThemed"}),a.createElement("main",{id:"mainPage",className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"dark"===p.theme?"darkThemed":"lightThemed"},a.createElement("div",{style:{display:"flex",flexDirection:"row",gap:3}},0===Object.keys(p.accountInformation).length?a.createElement(a.Fragment,null,a.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{p.setActivePopover(a.createElement(k,{title:"Sign In"},a.createElement(v,null)))}},"Sign In"),a.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{p.setActivePopover(a.createElement(k,{title:"Create Account"},a.createElement(b,null)))}},"Create Account")):a.createElement("button",{style:{fontSize:"14pt"},onClick:()=>{window.location="/chat"}},"Chat page")),a.createElement(a.Fragment,null,a.createElement("h1",null,"You found the Platypuss public beta!"),a.createElement("p",null,"This website sees new changes to the Platypuss client before they're published. This means you get to try out new features and improvements before they make their way to the main site. Beware though, many of the changes you see here aren't tested and may break certain functionality. Should anything not work properly you're better off using the ",a.createElement("a",{href:"https://platypuss.net"},"stable version")," of the site."))),a.createElement("footer",{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"dark"===p.theme?"darkThemed":"lightThemed"},"do you like the new interim logo? if not then feel free to design your own and hit me up with a ",a.createElement("a",{href:"https://github.com/kettle-7/platypuss/issues/new"},"github issue")),a.createElement(E,{className:"custom"===p.theme?"":"green"===p.theme?"greenThemed":"dark"===p.theme?"darkThemed":"lightThemed"}))};const x=()=>a.createElement(a.Fragment,null,a.createElement("title",null,"(Beta!) ","Platypuss"),a.createElement("link",{rel:"canonical",href:"https://beta.platypuss.net"}))},6841:function(e,t,n){var r=n(6540);function a(){return a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a.apply(this,arguments)}const o=["children","options"],l={blockQuote:"0",breakLine:"1",breakThematic:"2",codeBlock:"3",codeFenced:"4",codeInline:"5",footnote:"6",footnoteReference:"7",gfmTask:"8",heading:"9",headingSetext:"10",htmlBlock:"11",htmlComment:"12",htmlSelfClosing:"13",image:"14",link:"15",linkAngleBraceStyleDetector:"16",linkBareUrlDetector:"17",linkMailtoDetector:"18",newlineCoalescer:"19",orderedList:"20",paragraph:"21",ref:"22",refImage:"23",refLink:"24",table:"25",tableSeparator:"26",text:"27",textBolded:"28",textEmphasized:"29",textEscaped:"30",textMarked:"31",textStrikethroughed:"32",unorderedList:"33"};var c,i;(i=c||(c={}))[i.MAX=0]="MAX",i[i.HIGH=1]="HIGH",i[i.MED=2]="MED",i[i.LOW=3]="LOW",i[i.MIN=4]="MIN";const s=["allowFullScreen","allowTransparency","autoComplete","autoFocus","autoPlay","cellPadding","cellSpacing","charSet","className","classId","colSpan","contentEditable","contextMenu","crossOrigin","encType","formAction","formEncType","formMethod","formNoValidate","formTarget","frameBorder","hrefLang","inputMode","keyParams","keyType","marginHeight","marginWidth","maxLength","mediaGroup","minLength","noValidate","radioGroup","readOnly","rowSpan","spellCheck","srcDoc","srcLang","srcSet","tabIndex","useMap"].reduce(((e,t)=>(e[t.toLowerCase()]=t,e)),{for:"htmlFor"}),u={amp:"&",apos:"'",gt:">",lt:"<",nbsp:" ",quot:"“"},m=["style","script"],d=/([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi,p=/mailto:/i,h=/\n{2,}$/,f=/^(\s*>[\s\S]*?)(?=\n{2,})/,g=/^ *> ?/gm,y=/^ {2,}\n/,E=/^(?:( *[-*_])){3,} *(?:\n *)+\n/,k=/^\s*(`{3,}|~{3,}) *(\S+)?([^\n]*?)?\n([\s\S]+?)\s*\1 *(?:\n *)*\n?/,v=/^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/,b=/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,x=/^(?:\n *)*\n/,w=/\r\n?/g,C=/^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/,S=/^\[\^([^\]]+)]/,P=/\f/g,A=/^---[ \t]*\n(.|\n)*\n---[ \t]*\n/,I=/^\s*?\[(x|\s)\]/,T=/^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,M=/^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,N=/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/,$=/^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i,B=/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi,O=/^<!--[\s\S]*?(?:-->)/,R=/^(data|aria|x)-[a-z_][a-z\d_.-]*$/,z=/^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i,D=/^\{.*\}$/,L=/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,H=/^<([^ >]+@[^ >]+)>/,j=/^<([^ >]+:\/[^ >]+)>/,U=/-([a-z])?/gi,F=/^(.*\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/,W=/^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/,G=/^!\[([^\]]*)\] ?\[([^\]]*)\]/,_=/^\[([^\]]*)\] ?\[([^\]]*)\]/,q=/(\[|\])/g,Y=/(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/,X=/\t/g,Z=/(^ *\||\| *$)/g,V=/^ *:-+: *$/,J=/^ *:-+ *$/,Q=/^ *-+: *$/,K="((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~~.*?~~|==.*?==|.|\\n)*?)",ee=new RegExp(`^([*_])\\1${K}\\1\\1(?!\\1)`),te=new RegExp(`^([*_])${K}\\1(?!\\1|\\w)`),ne=new RegExp(`^==${K}==`),re=new RegExp(`^~~${K}~~`),ae=/^\\([^0-9A-Za-z\s])/,oe=/^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&#;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i,le=/^\n+/,ce=/^([ \t]*)/,ie=/\\([^\\])/g,se=/ *\n+$/,ue=/(?:^|\n)( *)$/,me="(?:\\d+\\.)",de="(?:[*+-])";function pe(e){return"( *)("+(1===e?me:de)+") +"}const he=pe(1),fe=pe(2);function ge(e){return new RegExp("^"+(1===e?he:fe))}const ye=ge(1),Ee=ge(2);function ke(e){return new RegExp("^"+(1===e?he:fe)+"[^\\n]*(?:\\n(?!\\1"+(1===e?me:de)+" )[^\\n]*)*(\\n|$)","gm")}const ve=ke(1),be=ke(2);function xe(e){const t=1===e?me:de;return new RegExp("^( *)("+t+") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1"+t+" (?!"+t+" ))\\n*|\\s*\\n*$)")}const we=xe(1),Ce=xe(2);function Se(e,t){const n=1===t,r=n?we:Ce,a=n?ve:be,o=n?ye:Ee;return{match(e,t,n){const a=ue.exec(n);return a&&(t.list||!t.inline&&!t.simple)?r.exec(e=a[1]+e):null},order:1,parse(e,t,r){const l=n?+e[2]:void 0,c=e[0].replace(h,"\n").match(a);let i=!1;return{items:c.map((function(e,n){const a=o.exec(e)[0].length,l=new RegExp("^ {1,"+a+"}","gm"),s=e.replace(l,"").replace(o,""),u=n===c.length-1,m=-1!==s.indexOf("\n\n")||u&&i;i=m;const d=r.inline,p=r.list;let h;r.list=!0,m?(r.inline=!1,h=s.replace(se,"\n\n")):(r.inline=!0,h=s.replace(se,""));const f=t(h,r);return r.inline=d,r.list=p,f})),ordered:n,start:l}},render:(t,n,r)=>e(t.ordered?"ol":"ul",{key:r.key,start:t.type===l.orderedList?t.start:void 0},t.items.map((function(t,a){return e("li",{key:a},n(t,r))})))}}const Pe=new RegExp("^\\[((?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*\\)"),Ae=/^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/,Ie=[f,k,v,T,N,M,O,F,ve,we,be,Ce],Te=[...Ie,/^[^\n]+(?:  \n|\n{2,})/,$,z];function Me(e){return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g,"a").replace(/[çÇ]/g,"c").replace(/[ðÐ]/g,"d").replace(/[ÈÉÊËéèêë]/g,"e").replace(/[ÏïÎîÍíÌì]/g,"i").replace(/[Ññ]/g,"n").replace(/[øØœŒÕõÔôÓóÒò]/g,"o").replace(/[ÜüÛûÚúÙù]/g,"u").replace(/[ŸÿÝý]/g,"y").replace(/[^a-z0-9- ]/gi,"").replace(/ /gi,"-").toLowerCase()}function Ne(e){return Q.test(e)?"right":V.test(e)?"center":J.test(e)?"left":null}function $e(e,t,n,r){const a=n.inTable;n.inTable=!0;let o=e.trim().split(/( *(?:`[^`]*`|<.*?>.*?<\/.*?>(?!<\/.*?>)|\\\||\|) *)/).reduce(((e,a)=>("|"===a.trim()?e.push(r?{type:l.tableSeparator}:{type:l.text,text:a}):""!==a&&e.push.apply(e,t(a,n)),e)),[]);n.inTable=a;let c=[[]];return o.forEach((function(e,t){e.type===l.tableSeparator?0!==t&&t!==o.length-1&&c.push([]):(e.type!==l.text||null!=o[t+1]&&o[t+1].type!==l.tableSeparator||(e.text=e.text.trimEnd()),c[c.length-1].push(e))})),c}function Be(e,t,n){n.inline=!0;const r=e[2]?e[2].replace(Z,"").split("|").map(Ne):[],a=e[3]?function(e,t,n){return e.trim().split("\n").map((function(e){return $e(e,t,n,!0)}))}(e[3],t,n):[],o=$e(e[1],t,n,!!a.length);return n.inline=!1,a.length?{align:r,cells:a,header:o,type:l.table}:{children:o,type:l.paragraph}}function Oe(e,t){return null==e.align[t]?{}:{textAlign:e.align[t]}}function Re(e){return function(t,n){return n.inline?e.exec(t):null}}function ze(e){return function(t,n){return n.inline||n.simple?e.exec(t):null}}function De(e){return function(t,n){return n.inline||n.simple?null:e.exec(t)}}function Le(e){return function(t){return e.exec(t)}}function He(e,t,n){if(t.inline||t.simple)return null;if(n&&!n.endsWith("\n"))return null;let r="";e.split("\n").every((e=>!Ie.some((t=>t.test(e)))&&(r+=e+"\n",e.trim())));const a=r.trimEnd();return""==a?null:[r,a]}function je(e){try{if(decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g,"").match(/^\s*(javascript|vbscript|data(?!:image)):/i))return null}catch(e){return null}return e}function Ue(e){return e.replace(ie,"$1")}function Fe(e,t,n){const r=n.inline||!1,a=n.simple||!1;n.inline=!0,n.simple=!0;const o=e(t,n);return n.inline=r,n.simple=a,o}function We(e,t,n){const r=n.inline||!1,a=n.simple||!1;n.inline=!1,n.simple=!0;const o=e(t,n);return n.inline=r,n.simple=a,o}function Ge(e,t,n){const r=n.inline||!1;n.inline=!1;const a=e(t,n);return n.inline=r,a}const _e=(e,t,n)=>({children:Fe(t,e[1],n)});function qe(){return{}}function Ye(){return null}function Xe(...e){return e.filter(Boolean).join(" ")}function Ze(e,t,n){let r=e;const a=t.split(".");for(;a.length&&(r=r[a[0]],void 0!==r);)a.shift();return r||n}function Ve(e="",t={}){function n(e,n,...r){const o=Ze(t.overrides,`${e}.props`,{});return t.createElement(function(e,t){const n=Ze(t,e);return n?"function"==typeof n||"object"==typeof n&&"render"in n?n:Ze(t,`${e}.component`,e):e}(e,t.overrides),a({},n,o,{className:Xe(null==n?void 0:n.className,o.className)||void 0}),...r)}function o(e){e=e.replace(A,"");let a=!1;t.forceInline?a=!0:t.forceBlock||(a=!1===Y.test(e));const o=J(V(a?e:`${e.trimEnd().replace(le,"")}\n\n`,{inline:a}));for(;"string"==typeof o[o.length-1]&&!o[o.length-1].trim();)o.pop();if(null===t.wrapper)return o;const l=t.wrapper||(a?"span":"div");let c;if(o.length>1||t.forceWrapper)c=o;else{if(1===o.length)return c=o[0],"string"==typeof c?n("span",{key:"outer"},c):c;c=null}return r.createElement(l,{key:"outer"},c)}function c(e,n){const a=n.match(d);return a?a.reduce((function(n,a,l){const c=a.indexOf("=");if(-1!==c){const i=function(e){return-1!==e.indexOf("-")&&null===e.match(R)&&(e=e.replace(U,(function(e,t){return t.toUpperCase()}))),e}(a.slice(0,c)).trim(),u=function(e){const t=e[0];return('"'===t||"'"===t)&&e.length>=2&&e[e.length-1]===t?e.slice(1,-1):e}(a.slice(c+1).trim()),m=s[i]||i,d=n[m]=function(e,t,n,r){return"style"===t?n.split(/;\s?/).reduce((function(e,t){const n=t.slice(0,t.indexOf(":"));return e[n.trim().replace(/(-[a-z])/g,(e=>e[1].toUpperCase()))]=t.slice(n.length+1).trim(),e}),{}):"href"===t||"src"===t?r(n,e,t):(n.match(D)&&(n=n.slice(1,n.length-1)),"true"===n||"false"!==n&&n)}(e,i,u,t.sanitizer);"string"==typeof d&&($.test(d)||z.test(d))&&(n[m]=r.cloneElement(o(d.trim()),{key:l}))}else"style"!==a&&(n[s[a]||a]=!0);return n}),{}):null}t.overrides=t.overrides||{},t.sanitizer=t.sanitizer||je,t.slugify=t.slugify||Me,t.namedCodesToUnicode=t.namedCodesToUnicode?a({},u,t.namedCodesToUnicode):u,t.createElement=t.createElement||r.createElement;const i=[],h={},Z={[l.blockQuote]:{match:De(f),order:1,parse:(e,t,n)=>({children:t(e[0].replace(g,""),n)}),render:(e,t,r)=>n("blockquote",{key:r.key},t(e.children,r))},[l.breakLine]:{match:Le(y),order:1,parse:qe,render:(e,t,r)=>n("br",{key:r.key})},[l.breakThematic]:{match:De(E),order:1,parse:qe,render:(e,t,r)=>n("hr",{key:r.key})},[l.codeBlock]:{match:De(v),order:0,parse:e=>({lang:void 0,text:e[0].replace(/^ {4}/gm,"").replace(/\n+$/,"")}),render:(e,t,r)=>n("pre",{key:r.key},n("code",a({},e.attrs,{className:e.lang?`lang-${e.lang}`:""}),e.text))},[l.codeFenced]:{match:De(k),order:0,parse:e=>({attrs:c("code",e[3]||""),lang:e[2]||void 0,text:e[4],type:l.codeBlock})},[l.codeInline]:{match:ze(b),order:3,parse:e=>({text:e[2]}),render:(e,t,r)=>n("code",{key:r.key},e.text)},[l.footnote]:{match:De(C),order:0,parse:e=>(i.push({footnote:e[2],identifier:e[1]}),{}),render:Ye},[l.footnoteReference]:{match:Re(S),order:1,parse:e=>({target:`#${t.slugify(e[1],Me)}`,text:e[1]}),render:(e,r,a)=>n("a",{key:a.key,href:t.sanitizer(e.target,"a","href")},n("sup",{key:a.key},e.text))},[l.gfmTask]:{match:Re(I),order:1,parse:e=>({completed:"x"===e[1].toLowerCase()}),render:(e,t,r)=>n("input",{checked:e.completed,key:r.key,readOnly:!0,type:"checkbox"})},[l.heading]:{match:De(t.enforceAtxHeadings?M:T),order:1,parse:(e,n,r)=>({children:Fe(n,e[2],r),id:t.slugify(e[2],Me),level:e[1].length}),render:(e,t,r)=>n(`h${e.level}`,{id:e.id,key:r.key},t(e.children,r))},[l.headingSetext]:{match:De(N),order:0,parse:(e,t,n)=>({children:Fe(t,e[1],n),level:"="===e[2]?1:2,type:l.heading})},[l.htmlBlock]:{match:Le($),order:1,parse(e,t,n){const[,r]=e[3].match(ce),a=new RegExp(`^${r}`,"gm"),o=e[3].replace(a,""),l=(i=o,Te.some((e=>e.test(i)))?Ge:Fe);var i;const s=e[1].toLowerCase(),u=-1!==m.indexOf(s),d=(u?s:e[1]).trim(),p={attrs:c(d,e[2]),noInnerParse:u,tag:d};return n.inAnchor=n.inAnchor||"a"===s,u?p.text=e[3]:p.children=l(t,o,n),n.inAnchor=!1,p},render:(e,t,r)=>n(e.tag,a({key:r.key},e.attrs),e.text||t(e.children,r))},[l.htmlSelfClosing]:{match:Le(z),order:1,parse(e){const t=e[1].trim();return{attrs:c(t,e[2]||""),tag:t}},render:(e,t,r)=>n(e.tag,a({},e.attrs,{key:r.key}))},[l.htmlComment]:{match:Le(O),order:1,parse:()=>({}),render:Ye},[l.image]:{match:ze(Ae),order:1,parse:e=>({alt:e[1],target:Ue(e[2]),title:e[3]}),render:(e,r,a)=>n("img",{key:a.key,alt:e.alt||void 0,title:e.title||void 0,src:t.sanitizer(e.target,"img","src")})},[l.link]:{match:Re(Pe),order:3,parse:(e,t,n)=>({children:We(t,e[1],n),target:Ue(e[2]),title:e[3]}),render:(e,r,a)=>n("a",{key:a.key,href:t.sanitizer(e.target,"a","href"),title:e.title},r(e.children,a))},[l.linkAngleBraceStyleDetector]:{match:Re(j),order:0,parse:e=>({children:[{text:e[1],type:l.text}],target:e[1],type:l.link})},[l.linkBareUrlDetector]:{match:(e,t)=>t.inAnchor?null:Re(L)(e,t),order:0,parse:e=>({children:[{text:e[1],type:l.text}],target:e[1],title:void 0,type:l.link})},[l.linkMailtoDetector]:{match:Re(H),order:0,parse(e){let t=e[1],n=e[1];return p.test(n)||(n="mailto:"+n),{children:[{text:t.replace("mailto:",""),type:l.text}],target:n,type:l.link}}},[l.orderedList]:Se(n,1),[l.unorderedList]:Se(n,2),[l.newlineCoalescer]:{match:De(x),order:3,parse:qe,render:()=>"\n"},[l.paragraph]:{match:He,order:3,parse:_e,render:(e,t,r)=>n("p",{key:r.key},t(e.children,r))},[l.ref]:{match:Re(W),order:0,parse:e=>(h[e[1]]={target:e[2],title:e[4]},{}),render:Ye},[l.refImage]:{match:ze(G),order:0,parse:e=>({alt:e[1]||void 0,ref:e[2]}),render:(e,r,a)=>h[e.ref]?n("img",{key:a.key,alt:e.alt,src:t.sanitizer(h[e.ref].target,"img","src"),title:h[e.ref].title}):null},[l.refLink]:{match:Re(_),order:0,parse:(e,t,n)=>({children:t(e[1],n),fallbackChildren:t(e[0].replace(q,"\\$1"),n),ref:e[2]}),render:(e,r,a)=>h[e.ref]?n("a",{key:a.key,href:t.sanitizer(h[e.ref].target,"a","href"),title:h[e.ref].title},r(e.children,a)):n("span",{key:a.key},r(e.fallbackChildren,a))},[l.table]:{match:De(F),order:1,parse:Be,render(e,t,r){const a=e;return n("table",{key:r.key},n("thead",null,n("tr",null,a.header.map((function(e,o){return n("th",{key:o,style:Oe(a,o)},t(e,r))})))),n("tbody",null,a.cells.map((function(e,o){return n("tr",{key:o},e.map((function(e,o){return n("td",{key:o,style:Oe(a,o)},t(e,r))})))}))))}},[l.text]:{match:Le(oe),order:4,parse:e=>({text:e[0].replace(B,((e,n)=>t.namedCodesToUnicode[n]?t.namedCodesToUnicode[n]:e))}),render:e=>e.text},[l.textBolded]:{match:ze(ee),order:2,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("strong",{key:r.key},t(e.children,r))},[l.textEmphasized]:{match:ze(te),order:3,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("em",{key:r.key},t(e.children,r))},[l.textEscaped]:{match:ze(ae),order:1,parse:e=>({text:e[1],type:l.text})},[l.textMarked]:{match:ze(ne),order:3,parse:_e,render:(e,t,r)=>n("mark",{key:r.key},t(e.children,r))},[l.textStrikethroughed]:{match:ze(re),order:3,parse:_e,render:(e,t,r)=>n("del",{key:r.key},t(e.children,r))}};!0===t.disableParsingRawHTML&&(delete Z[l.htmlBlock],delete Z[l.htmlSelfClosing]);const V=function(e){let t=Object.keys(e);function n(r,a){let o=[],l="";for(;r;){let c=0;for(;c<t.length;){const i=t[c],s=e[i],u=s.match(r,a,l);if(u){const e=u[0];r=r.substring(e.length);const t=s.parse(u,n,a);null==t.type&&(t.type=i),o.push(t),l=e;break}c++}}return o}return t.sort((function(t,n){let r=e[t].order,a=e[n].order;return r!==a?r-a:t<n?-1:1})),function(e,t){return n(function(e){return e.replace(w,"\n").replace(P,"").replace(X,"    ")}(e),t)}}(Z),J=(Q=function(e,t){return function(n,r,a){const o=e[n.type].render;return t?t((()=>o(n,r,a)),n,r,a):o(n,r,a)}}(Z,t.renderRule),function e(t,n={}){if(Array.isArray(t)){const r=n.key,a=[];let o=!1;for(let l=0;l<t.length;l++){n.key=l;const r=e(t[l],n),c="string"==typeof r;c&&o?a[a.length-1]+=r:null!==r&&a.push(r),o=c}return n.key=r,a}return Q(t,e,n)});var Q;const K=o(e);return i.length?n("div",null,K,n("footer",{key:"footer"},i.map((function(e){return n("div",{id:t.slugify(e.identifier,Me),key:e.identifier},e.identifier,J(V(e.footnote,{inline:!0})))})))):K}t.Ay=e=>{let{children:t="",options:n}=e,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t.indexOf(n=o[r])>=0||(a[n]=e[n]);return a}(e,o);return r.cloneElement(Ve(t,n),a)}}}]);
//# sourceMappingURL=component---src-pages-index-js-f0a97a87a174343f1e87.js.map