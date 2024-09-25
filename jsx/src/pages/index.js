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
import Markdown from 'markdown-to-jsx';
import * as React from "react";
import "./themery.scss";

const PRODUCTION = false; // don't change this other than for testing

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
      states.setActivePopover(<CreateAccountPopover error="Your passwords don't match"/>);
      return;
    }
    if (passwordRef.current.value.replace(/[\n\r\t ]/g, "") === "") {
      states.setActivePopover(<CreateAccountPopover error="Your password must be at least one character"/>);
      return;
    }
    if (usernameRef.current.value.replace(/[\n\r\t ]/g, "") === "") {
      states.setActivePopover(<CreateAccountPopover error="Your username must be at least one character"/>);
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
        states.setActivePopover(<CreateAccountPopover error={<>There's already an account with that email address,
          would you like to <a href="#" onClick={() => states.setActivePopover(<SignInPopover/>)}>sign in</a> instead?</>}/>);
        return;
      }
      states.setActivePopover(<Popover title="Check your emails!">Thanks for joining us, 
        you should get <br/> an email in the next few minutes to <br/> confirm the new account.</Popover>);
      return;
    } else {
      if (!response.alreadyExists) {
        states.setActivePopover(<SignInPopover error={<>There's no account with that email address,
          would you like to <a href="#" onClick={() => states.setActivePopover(<CreateAccountPopover/>)}>create one</a>?</>}/>);
        return;
      }
      if (!response.passwordMatches) {
        states.setActivePopover(<SignInPopover error="Incorrect password for this account"/>);
        return;
      }
    }
    localStorage.setItem("sessionID", response.sessionID);
    window.location = "/chat";
  });
}

function PageHeader ({title, iconClickEvent, ...props}) {
  let customThemeDisplayRef = React.useRef(null);
  let customThemeEditRef = React.useRef(null);

  React.useEffect(() => {
    fetch(authUrl + "/uinfo?id=" + localStorage.getItem("sessionID"))
      .then(data => data.json())
      .then(data => states.setAccountInformation(data))
      .catch(() => { if (pageUrl.pathname === "/chat") window.location = "/" });
  }, []);

  return (<header {...props}>
    <img className="avatar" onClick={iconClickEvent ? iconClickEvent : () => {window.location = "/"}} style={{cursor: "pointer"}} src="/icons/icon-96x96.png"/>
    <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
        {title ? title : PRODUCTION ? "Platypuss" : "(Beta!) Platypuss"}
    </h2>
    <div style={{flexGrow: 1}}></div>
    <img className="avatar" style={{cursor: "pointer", display: Object.keys(states.accountInformation).length ? "flex" : "none"}} src={authUrl+states.accountInformation.avatar} onClick={() => {
      states.setActivePopover(
        <Popover title="Account Settings">
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
          <div contentEditable id="changeAboutMe"></div>
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
          <button>Delete Account</button>
          <button>Change Password</button>
          <button onClick={() => {
            localStorage.setItem("sessionID", null);
            window.location = "/";
          }}>Log Out</button>
          <button onClick={() => {states.setActivePopover(null);}}>Done</button>
        </Popover>
      );
    }}/>
  </header>);
};

function PopoverParent({...props}) {
  [states.activePopover, states.setActivePopover] = React.useState(null);
  return (
    <div id="popoverParent" style={{display: states.activePopover == null ? "none" : "flex"}} onClick={() => {
      states.setActivePopover(null);
    }} {...props}>{states.activePopover}</div>
  );
}

// for popups / popovers in desktop, render as separate screens on mobile
function Popover({children, title, style={}, ...props}) {
  return <div id="popover" style={{margin: style.margin ? style.margin : "auto", ...style}} onClick={event => {
    event.stopPropagation();
  }} {...props}>
    <div id="popoverHeaderBar">
      <h3>{title}</h3>
      <div style={{flexGrow: 1}}></div>
      <button onClick={() => {states.setActivePopover(null);}} className="material-symbols-outlined">close</button>
    </div>
    {children}
  </div>
}

function SignInPopover ({ error="" }) {
  return (<Popover title="Sign In">
    <span>Welcome back! If you don't already have an account please <a href="#" onClick={() => states.setActivePopover(<CreateAccountPopover/>)}>create an account</a> instead.</span>
    <div id="loginform">
      <em id="signInErrorMessage">{error}</em>
      <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
      <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
      <label>Password </label><input type="password" id="password" className="textBox" ref={passwordRef}/>
      </div><br/>
      <button onClick={() => doTheLoginThingy(false)}>Sign In</button>
    </div>
  </Popover>);
}

function CreateAccountPopover ({ error="" }) {
  return (<Popover title="Create Account">
    <span>Welcome to Platypuss! If you already have an account please <a href="#" onClick={() => states.setActivePopover(<SignInPopover/>)}>sign in</a> instead.</span>
    <br/><strong>By using Platypuss you confirm that you have read and agreed to our <a href="/legal">legal agreements</a>.</strong>
    <div id="loginform">
      {error ? <em id="signInErrorMessage">{error}</em> : ""}
      <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
      <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
      <label>Username </label><input type="text" id="unam" className="textBox" ref={usernameRef}/>
      <label>Password </label><input type="password" id="password" className="textBox" ref={passwordRef}/>
      <label>Confirm Password </label><input type="password" id="confirmPassword" className="textBox" ref={confirmPasswordRef}/>
      </div><br/>
      <button onClick={() => doTheLoginThingy(true)}>Create Account</button>
    </div>
  </Popover>);
}

const IndexPage = () => {
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
      {(Object.keys(states.accountInformation).length !== 0) && <button style={{fontSize: "14pt"}} onClick={() => {window.location = '/chat'}}>Chat</button>}
      {(Object.keys(states.accountInformation).length === 0) && <><button style={{fontSize: "14pt"}} onClick={() => {states.setActivePopover(<SignInPopover/>)}}>Sign In</button><br/></>}
      {(Object.keys(states.accountInformation).length === 0) && <button style={{fontSize: "14pt"}} onClick={() => {states.setActivePopover(<CreateAccountPopover/>)}}>Create Account</button>}
      {PRODUCTION ? <Markdown>{`
Platypuss
=========

Platypuss is an open-source, decentralised platform for communicating and file sharing.
It's a three-part system with a client, one or more servers and an authentication backend.
The client handles allowing you to connect to all of your servers and send a recieve messages.
The servers are responsible for storing and distribution of messages, and the authentication
backend keeps track of accounts, logging in, and logging out.

Why use Platypuss?
------------------

There are a few Platypuss alternatives floating around out there. There are a few main goals of
Platypuss:
- Performance: Platypuss should be efficient on your system so that anyone can use it without
  waiting minutes for button clicks to register. This is sadly underconsidered in the development of modern apps.
- Open source: [Platypuss' code](https://github.com/kettle-7/platypuss) is free to use, modify
  and distribute as per [the GNU GPL version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).
  It does not cost you money, there are no ads (so far) and it's built and maintained by volunteers.
- More decentralised: Compared to many other alternatives Platypuss is more decentralised,
  meaning flexibility for server owners and users while avoiding compromising security and
  privacy where possible.
- Easy to use: Platypuss is designed to not need a user guide. You can invite people to
  servers with links, and from there they will comfortably find their way around.
- Customisable: Because of how decentralised it is server owners are free to add functionality
  and the client can also easily be modified. You can make Platypuss do just about anything you
  like.

How to get started
------------------

Platypuss is in an alpha stage at the moment. I will not neccessarily provide support for any
issues you have, although do please [let me know](https://github.com/kettle-7/platypuss/issues)
about any you come across so that I can work towards fixing them. It's in a rather volatile
state where lots is prone to change so I will not yet publicise the instructions for how to
host your own server, although you can expect this to come soon.
      `}</Markdown> : <>
        <h1>
          You found the Platypuss public beta!
        </h1>
        <p>
          This website sees new changes to the Platypuss client before they're published.
          This means you get to try out new features and improvements before they make their way
          to the main site. Beware though, many of the changes you see here aren't tested and may
          break certain functionality. Should anything not work properly you're better off using
          the <a href="https://platypuss.net">stable version</a> of the site.
        </p>
      </>}
    </main>
    <footer className={
      states.theme === "custom" ? "" :
      states.theme === "green" ? "greenThemed" :
      states.theme === "dark" ? "darkThemed" :
      "lightThemed"}>do you like the new interim logo? if not then feel free to design your own and hit me up with a <a href="https://github.com/kettle-7/platypuss/issues/new">github issue</a></footer>
    <PopoverParent className={
      states.theme === "custom" ? "" :
      states.theme === "green" ? "greenThemed" :
      states.theme === "light" ? "lightThemed" :
      "darkThemed"}/>
  </>);
};

export default IndexPage;

export const Head = () => (
  <title>{PRODUCTION ? "" : "(Beta!) "}Platypuss</title>
);
