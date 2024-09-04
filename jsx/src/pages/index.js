/************************************************************************
* Copyright 2021-2024 Ben Keppel                                        *
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

import * as React from "react";
import "./themery.scss";

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
    if (passwordRef.current.value != confirmPasswordRef.current.value) {
      states.setActivePopover(<CreateAccountPopover error="Your passwords don't match"/>);
      return;
    }
    if (passwordRef.current.value.replace(/[\n\r\t ]/g, "") == "") {
      states.setActivePopover(<CreateAccountPopover error="Your password must be at least one character"/>);
      return;
    }
    if (usernameRef.current.value.replace(/[\n\r\t ]/g, "") == "") {
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
    return (<header {...props}>
        <img className="avatar" onClick={iconClickEvent ? iconClickEvent : () => {window.location = "/"}} style={{cursor: "pointer"}} src="/icons/icon-48x48.png"/>
        <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
            {title ? title : "(Beta!) Platypuss"}
        </h2>
        {(Object.keys(states.accountInformation).length != 0) && <button onClick={() => {window.location = '/chat'}}>Chat</button>}
        <div style={{flexGrow: 1}}></div>
        {(Object.keys(states.accountInformation).length != 0) && <img className="avatar" alt="🐙" style={{cursor: "pointer"}} src={authUrl+states.accountInformation.avatar}/>}
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
    <span>Welcome back! If you don't already have an account <br/> please <a href="#" onClick={() => states.setActivePopover(<CreateAccountPopover/>)}>create an account</a> instead.</span>
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
    <span>Welcome to Platypuss! If you already have an account <br/> please <a href="#" onClick={() => states.setActivePopover(<SignInPopover/>)}>sign in</a> instead.</span>
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
          .catch(() => { if (pageUrl.pathname == "/chat") window.location = "/" });
  }, []);

  // These let us refer to the text boxes later on
  emailRef = React.useRef(null);
  passwordRef = React.useRef(null);
  usernameRef = React.useRef(null);
  confirmPasswordRef = React.useRef(null);
  let theme = "medium";
  if (browser)
    if (localStorage.getItem("theme"))
      theme = localStorage.getItem("theme");

  [states.theme, states.setTheme] = React.useState(theme);

  return (<>
    <PageHeader className={states.theme == "light" ? "lightThemed" : "darkThemed"}/>
    <main id="mainPage" className={states.theme == "dark" ? "darkThemed" : "lightThemed"}>
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
      {(Object.keys(states.accountInformation).length === 0) && <button onClick={() => {states.setActivePopover(<SignInPopover/>)}}>Sign In</button>}
      {(Object.keys(states.accountInformation).length === 0) && <button onClick={() => {states.setActivePopover(<CreateAccountPopover/>)}}>Create Account</button>}
    </main>
    <footer className={states.theme == "dark" ? "darkThemed" : "lightThemed"}>links to stuff maybe</footer>
    <PopoverParent className={states.theme == "light" ? "lightThemed" : "darkThemed"}/>
  </>);
};

export default IndexPage;

export const Head = () => (
  <title>(Beta!) Platypuss</title>
);
