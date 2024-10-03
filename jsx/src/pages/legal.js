/************************************************************************
* Copyright 2021-2024 Ben Keppel, Moss Finder                           *
*                                                                       *
* This program is free software: you can redistribute it and/or modify  *
* it under the terms of the GNU General Public License as published by  *
* the Free Software Foundation, either version 3 of the License, or     *
* (at your option) any later version.                                   *
*                                                                       *
* This program is distributed in the hope that it will be useful,       *
* but WITHOUT ANY WARRANTY; without even the implied warranty of        *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
* GNU General Public License for more details.                          *
*                                                                       *
* You should have received a copy of the GNU General Public License     *
* along with this program.  If not, see <http://www.gnu.org/licenses/>. *
************************************************************************/

import updateCustomTheme from '../components/rgb';
import * as React from "react";
import "./themery.scss";
import Markdown from 'markdown-to-jsx';

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
var browser = typeof window !== "undefined"; // check if we're running in a browser rather than the build environment
var pageUrl = browser ? new URL(window.location) : new URL("http://localhost:8000"); // window is not defined in the testing environment so just assume localhost
const authUrl = "https://platypuss.net"; // this shouldn't need to change but just in case
var states = {}; // One global variable for storing React state objects so we can access them anywhere
var emailRef, passwordRef, confirmPasswordRef, usernameRef;

// thanks bryc on stack overflow ^w^
function hashPassword (str, seed = 20) { // hashes passwords somehow
  let h1 = 0xdeadbeef ^ seed, // had to be something
  h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      // Math.imul multiplies without loss of precision
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (h2>>>0).toString(16).padStart(8,0)+(h1>>>0).toString(16).padStart(8,0);
};

function doTheLoginThingy(createNewAccount) {
  if (createNewAccount) {
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover error="Your passwords don't match"/></Popover>);
      return;
    }
    if (passwordRef.current.value.replace(/[\n\r\t ]/g, "") === "") {
      states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover error="Your password must be at least one character"/></Popover>);
      return;
    }
    if (usernameRef.current.value.replace(/[\n\r\t ]/g, "") === "") {
      states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover error="Your username must be at least one character"/></Popover>);
      return;
    }
  }
  fetch(`${authUrl}/login`, { // send this data to the authentication server, accepting a json response
    method: "POST",
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify({ // the information we send to the authentication server
      createNew: createNewAccount,
      server: "example.com", // can be anything so long as no platypuss server will actually be hosted there,
      email: emailRef.current.value,
      username: createNewAccount ? usernameRef.current.value : undefined,
      password: hashPassword(passwordRef.current.value)
    })
    // we take the response and save the session token to the browser
  }).then(response => response.json()).then(response => {
    if (createNewAccount) {
      if (response.alreadyExists) {
        states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover error={<>There's already an account with that email address,
          would you like to <a href="#" onClick={() => states.setActivePopover(<Popover title="Sign In"><SignInPopover/></Popover>)}>sign in</a> instead?</>}/></Popover>);
        return;
      }
      states.setActivePopover(<Popover title="Check your emails!">Thanks for joining us, 
        you should get <br/> an email in the next few minutes to <br/> confirm the new account.</Popover>);
      return;
    } else {
      if (!response.alreadyExists) {
        states.setActivePopover(<Popover title="Sign In"><SignInPopover error={<>There's no account with that email address,
          would you like to <a href="#" onClick={() => states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover/></Popover>)}>create one</a>?</>}/></Popover>);
        return;
      }
      if (!response.passwordMatches) {
        states.setActivePopover(<Popover title="Sign In"><SignInPopover error="Incorrect password for this account"/></Popover>);
        return;
      }
    }
    localStorage.setItem("sessionID", response.sessionID);
    window.location = "/chat";
  });
}

function AccountSettings() {
  let customThemeDisplayRef = React.useRef(null);
  let customThemeEditRef = React.useRef(null);
  let aboutMeRef = React.useRef(null);

  React.useEffect(() => {
    aboutMeRef.current.innerText = states.accountInformation.aboutMe.text;
  }, [states.accountInformation]);
  
  return (
    <>
      <div id="profileBanner">
        <div className="avatar" id="changeAvatarHoverButton" onClick={() => {
          let input = document.createElement('input');
          input.type = "file";
          input.multiple = false;
          input.accept = "image/*";
          input.onchange = async function (event) {
            let file = event.target.files[0];
            if (file.size >= 10000000) {
              states.setActivePopover(<Popover title="Woah, that's too big!">
                We only allow avatar sizes up to 10MB, this is to save storage space on the server. Please choose a smaller image or resize it in an image editor.
              </Popover>);
              return;
            }
            let request = new XMLHttpRequest();
            request.open("POST", `${authUrl}/pfpUpload?id=${localStorage.getItem("sessionID")}`);
            request.onreadystatechange = () => {
              if (request.readyState === XMLHttpRequest.DONE && request.status) {
                window.location.reload();
              }
              else {
                console.log(request);
              }
            };
            request.upload.onprogress = (event) => {
              states.setAvatarProgress(event.loaded/event.total*100);
            };
            request.send(await file.bytes());
          };
          input.click();
        }}>
          <img className="avatar" id="changeAvatar" src={authUrl+states.accountInformation.avatar}/>
          <span id="changeAvatarText">Change</span>
        </div>
        <h3 id="accountSettingsUsername" contentEditable>{states.accountInformation.username}</h3> @{states.accountInformation.tag}
      </div>
      <h5>Tell us a bit about you:</h5>
      <div contentEditable id="changeAboutMe" ref={aboutMeRef} onInput={() => {
        fetch(`${authUrl}/editAboutMe?id=${localStorage.getItem("sessionID")}`, {
          headers: {
            'Content-Type': 'text/plain'
          },
          method: "POST",
          body: JSON.stringify({text: aboutMeRef.current.innerText})
        });
        let newAccountInformation = {...states.accountInformation};
        newAccountInformation.aboutMe.text = aboutMeRef.current.innerText;
        states.setAccountInformation(newAccountInformation);
      }}/>
      <div style={{
          flexGrow: 0,
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center"
          }}>
        Theme:
        <select defaultValue={states.theme}>
          <option value="dark" onClick={() => {setTimeout(() => {
            states.setTheme("dark");
            localStorage.setItem("theme", "dark");
            customThemeDisplayRef.current.hidden = true;
          }, 50);}}>Dark</option>
          <option value="medium" onClick={() => {setTimeout(() => {
            states.setTheme("medium");
            localStorage.setItem("theme", "medium");
            customThemeDisplayRef.current.hidden = true;
          }, 50);}}>Medium</option>
          <option value="light" onClick={() => {setTimeout(() => {
            states.setTheme("light");
            localStorage.setItem("theme", "light");
            customThemeDisplayRef.current.hidden = true;
          }, 50);}}>Light</option>
          <option value="green" onClick={() => {setTimeout(() => {
            states.setTheme("green");
            localStorage.setItem("theme", "green");
            customThemeDisplayRef.current.hidden = true;
          }, 50);}}>Greeeeeeeeeeeeeeeeeeeeeeeeeeen</option>
          <option value="custom" onClick={() => {setTimeout(() => {
            states.setTheme("custom");
            localStorage.setItem("theme", "custom");
            customThemeDisplayRef.current.hidden = false;
          }, 50);}}>Custom</option>
        </select>
      </div>
      <span hidden={states.theme !== "custom"} ref={customThemeDisplayRef}>Custom Theme Hex Colour: #
        <span id="accountSettingsCustomTheme" contentEditable
        ref={customThemeEditRef} onInput={() => {
            updateCustomTheme(customThemeEditRef.current.innerText, states);
          }}>
          {states.themeHex}
        </span>
      </span>
      <button onClick={() => {
      setTimeout(() => {
        states.setActivePopover(<Popover title={"Do you really want to delete your account?"}>
          <button onClick={() => {
            fetch(authUrl+'/deleteAccount?id='+localStorage.getItem("sessionID")).then(() => {
              window.location = "/";
            });
          }}>Yes</button>
          <button onClick={() => {
            setTimeout(() => {
              states.setActivePopover(<Popover title="Account Settings"><AccountSettings/></Popover>);
            }, 50);
          }}>No</button>
        </Popover>);
      }, 50);
      }}>Delete Account</button>
      <button>Change Password</button>
      <button onClick={() => {
        localStorage.setItem("sessionID", null);
        window.location = "/";
      }}>Log Out</button>
      <button onClick={() => {states.setActivePopover(null);}}>Done</button>
    </>
  );
}

function PageHeader ({title, iconClickEvent, ...props}) {
  React.useEffect(() => {
    fetch(authUrl + "/uinfo?id=" + localStorage.getItem("sessionID"))
      .then(data => data.json())
      .then(data => states.setAccountInformation(data))
      .catch(() => { if (pageUrl.pathname === "/chat") window.location = "/" });
  }, []);

  return (<header {...props}>
    <img className="avatar" onClick={iconClickEvent ? iconClickEvent : () => {window.location = "/"}} style={{cursor: "pointer"}} src="/icons/icon-96x96.png"/>
    <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
        {title ? title : "(Beta!) Platypuss"}
    </h2>
    <div style={{flexGrow: 1}}></div>
    <img className="avatar" style={{cursor: "pointer", display: Object.keys(states.accountInformation).length ? "flex" : "none"}} src={authUrl+states.accountInformation.avatar} onClick={() => {
      states.setActivePopover(<Popover title="Account Settings"><AccountSettings/></Popover>);
    }}/>
  </header>);
};

function PopoverParent({...props}) {
  [states.activePopover, states.setActivePopover] = React.useState(null);
  return (
    <div id="popoverParent" style={{display: "flex", height: states.activePopover === null ? 0 : "100%"}} onMouseDown={() => {setTimeout(() => {
      states.setActivePopover(null);
    }, 50)}} {...props}>{states.activePopover || <Popover style={{opacity: 0}}/>}</div>
  );
}

// for popups / popovers in desktop, render as separate screens on mobile
function Popover({children, title, style={}, ...props}) {
  let popoverRef = React.useRef(null);
  return <div id="popover" style={{margin: style.margin ? style.margin : "auto", /*height: 0,*/ ...style}} onClick={event => {
    event.stopPropagation();
  }} onMouseDown={event => {
    event.stopPropagation();
  }} className={states.activePopover ? "slideUp" : ""} ref={popoverRef} {...props}>
    {title ? <div id="popoverHeaderBar">
      <h3>{title}</h3>
      <div style={{flexGrow: 1}}></div>
      <button onClick={()=>{setTimeout(()=>{states.setActivePopover(null);}, 50)}} className="material-symbols-outlined">close</button>
    </div> : <button onClick={()=>{setTimeout(()=>{states.setActivePopover(null);}, 50)}} style={{
      position: "absolute",
      top: 5,
      right: 5
    }} className="material-symbols-outlined">close</button>}
    {children}
  </div>
}

function SignInPopover ({ error="" }) {
  return (<>
    <span>Welcome back! If you don't already have an account please <a href="#" onClick={() => states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover/></Popover>)}>create an account</a> instead.</span>
    <div id="loginform">
      <em id="signInErrorMessage">{error}</em>
      <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
        <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
        <label>Password </label><input type="password" id="password" className="textBox" ref={passwordRef}/>
      </div>
    </div>
    <button onClick={() => doTheLoginThingy(false)}>Sign In</button>
  </>);
}

function CreateAccountPopover ({ error="" }) {
  return (<>
  <span>Welcome to Platypuss! If you already have an account please <a href="#" onClick={() => states.setActivePopover(<Popover title="Sign In"><SignInPopover/></Popover>)}>sign in</a> instead.</span>
  <br/><strong>By using Platypuss you confirm that you have read and agreed to our <a href="/legal">legal agreements</a>.</strong>
    <div id="loginform">
      {error ? <em id="signInErrorMessage">{error}</em> : ""}
      <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
        <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
        <label>Username </label><input type="text" id="unam" className="textBox" ref={usernameRef}/>
        <label>Password </label><input type="password" id="password" className="textBox" ref={passwordRef}/>
        <label>Confirm Password </label><input type="password" id="confirmPassword" className="textBox" ref={confirmPasswordRef}/>
      </div>
    </div>
    <button onClick={() => doTheLoginThingy(true)}>Create Account</button>
  </>);
}

const LegalPage = () => {
  // Get the account information for the user
  [states.accountInformation, states.setAccountInformation] = React.useState({});

  React.useEffect(() => {
      fetch(authUrl + "/uinfo?id=" + localStorage.getItem("sessionID"))
          .then(data => data.json())
          .then(data => states.setAccountInformation(data))
          .catch(() => { if (pageUrl.pathname === "/chat") window.location = "/" });
  }, []);

  // These let us refer to the text boxes later on
  emailRef = React.useRef(null);
  passwordRef = React.useRef(null);
  usernameRef = React.useRef(null);
  confirmPasswordRef = React.useRef(null);
  
  let theme = "medium";
  let themeHex = "000000";
  if (browser && !states.hasRendered) {
    themeHex = localStorage.getItem("themeHex");
    if (themeHex == null) themeHex = "000000";
    switch (localStorage.getItem("theme")) {
      case "custom":
      case "dark":
      case "light":
      case "green":
      case "medium":
        theme = localStorage.getItem("theme");
        break;
      default:
        break;
    }
  }

  [states.theme, states.setTheme] = React.useState(theme); // what theme we're using
  [states.themeHex, states.setThemeHex] = React.useState(themeHex); // hex colour code of our custom theme

  return (<>
    <PageHeader className={
      states.theme === "custom" ? "" :
      states.theme === "green" ? "greenThemed" :
      states.theme === "light" ? "lightThemed" :
      "darkThemed"}/>
    <main id="mainPage" className={
      states.theme === "custom" ? "" :
      states.theme === "green" ? "greenThemed" :
      states.theme === "dark" ? "darkThemed" :
      "lightThemed"}>
      <Markdown>{`
Legal stuff!
============

I would strongly reccommend reading this document, as it outlines a lot of
very important information and many websites will sneak whatever they want
in here and you won't notice, and then you'll be legally bound to those
terms. Anyway, I want to keep this short, sweet and easy to understand.

Updates to this agreement
-------------------------

By making an account for Platypuss you agree to be bound by this agreement,
and because I'm not a lawyer I'll probably need to update it from time to
time to ensure my website doesn't end up in a fiery grave due to some new
loophole. If I do need to push an update I will provide notice by way of a
banner at the top of the Platypuss home page
([https://platypuss.net](https://platypuss.net)) for two weeks, and starting
from when you next log in after these two weeks you will be bound by the new
terms. Should a more urgent update need to be made I will provide you notice
by email.

Using this software
-------------------

I'm not a company. I will not accept responsibility for anything that happens
as a result of your use or misuse of the software. You can use it, modify it,
share it, etc. under the terms of the
[GNU Public License V3](https://www.gnu.org/licenses/gpl-3.0.html). By using
the software you are saying that you agree to those terms. I believe in
open-source software, so the "reference" server and client are both open
sourced and available on GitHub. The usual common sense applies, don't say
that you made it (or anybody else except for me), don't try take me to court
if it doesn't work the way you want it to, but do tell me about any bugs
because I do actually want to fix them.

I reserve the right to stop you from using the software:
--------------------------------------------------------

- If you claim to have made it,
- If you are using it or trying to use it for illegal purposes or to harm other
  people or
- If you are attempting to exploit flaws in the software for malicious purposes.

Data the software collects about you
------------------------------------

When you use the website I do collect some neccessary data on you so that I
can make it actually work the way it should, this includes:
- Your e-mail address (for most accounts): I don't send you emails unless I
  have to because it's quite annoying to try and do. I don't have any reason
  to look at your email address either, it's stored safely in a database. The
  only reason I collect it at all is so that I can try to prevent people from
  making lots of accounts (you can just use another e-mail address but that's
  enough to deter most people). I don't share your e-mail address with anyone.
  The only times it will be used is when you first create your account to
  verify that you do in fact own that e-mail address, when any urgent updates
  need to be made to this document (hopefully never) and when you request an
  e-mail to reset your Platypuss password.
- Your password: I can't see your password. It's encrypted on the client side
  (in your browser before you click the Sign In button) so neither the actual
  password nor the neccessary information to acquire it is provided to the
  server. Nonetheless this will not be shared with any third party and is used
  to allow you to sign in to your account securely.
- A list of servers you're in: This is collected so that the app can sync the
  servers you're in between devices, this just means you don't have to join
  the same server once for every device you log into. This is not shared with
  third parties.
- Your profile picture (if you upload one): This is shared publicly with others
  using the service, it's sort of the entire point of having a profile picture,
  and as such you take responsibility over what you upload and accept that you're
  sharing it publicly.
- Your "about me" section (if you set one): Same goes as for the profile
  picture. I'd suggest not putting sensitive information here.

Data server owners can collect
------------------------------

I can't control what server owners do with the data they get but I do know
what data they get and why they get it.
- The messages you send: So that they can send it to everybody else. This is
  seen by the server owner and usually everybody else in the server too. Don't
  share anything you're not confident sharing.
- Images you attach to your messages: These are uploaded to the individual
  servers now. The owner of the server can see this, usually everybody else on
  the server can as well. Don't share information you don't want shared.
- Your profile information: your profile picture (if you upload one), your
  username and your "about me" section are visible to everybody else who is in
  a server with you, including the owner of the server.

Data they can't collect
-----------------------

- Your password: this is never shared with anyone, and server owners can't gain
  access to your account unless you provide them with your password or access to
  your email address.
- Your email address: this is never shared with server owners or other users of
  the platform. We use a third-party partner called [mailtrap](https://mailtrap.io/)
  to allow us to send emails such as verification emails and password reset emails,
  as such the content of these emails and the addresses they're sent to does need
  to be shared with them, and I don't have control over and won't take responsibility
  for what they do with it.
- Which other servers you're in, this isn't shared with anybody else either.

© 2020-2024 Ben Keppel and [other github contributors](https://github.com/kettle-7/platypuss/graphs/contributors)
      `}</Markdown>
    </main>
    <footer className={
      states.theme === "custom" ? "" :
      states.theme === "green" ? "greenThemed" :
      states.theme === "dark" ? "darkThemed" :
      "lightThemed"}>do you like the new interim logo? if not then feel free to design your own and hit me up with a <a href="https://github.com/kettle-7/platypuss/issues/new">github issue</a></footer>
    <PopoverParent className={
      states.theme === "custom" ? "" :
      states.theme === "green" ? "greenThemed" :
      states.theme === "dark" ? "darkThemed" :
      "lightThemed"}/>
  </>);
};

export default LegalPage;

export const Head = () => (
  <title>Legal | Beta Platypuss</title>
);
