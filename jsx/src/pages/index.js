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

import * as Common from "../components/common";
import * as React from "react";
import "./light.scss";

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
const authUrl = "https://platypuss.net"; // this shouldn't need to change but just in case
var emailRef, usernameRef, passwordRef, secondPasswordRef;

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

var createNewAccount = false; // whether we're signing in or making a new account, signing in being false and default

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};
const paragraphStyles = {
  marginBottom: 48,
};

function doTheLoginThingy() {
  let loginInformation = JSON.stringify({ // the information we send to the authentication server
    createNew: createNewAccount,
    ift: createNewAccount,
    server: "example.com", // can be anything so long as no platypuss server will actually be hosted there,
    ser: "example.com",
    email: emailRef.current.value,
    pwd: hashPassword(passwordRef.current.value),
    password: hashPassword(passwordRef.current.value)
  });
  console.log(loginInformation);
  fetch(`${authUrl}/login`, { // send this data to the authentication server, accepting a json response
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginInformation)
    // we take the response and save the session token to the browser
  }).then(response => response.json()).then(response => {
    localStorage.setItem("sessionID", response.sessionID);
    window.location = "/chat";
  });
}

const IndexPage = () => {
  // These let us refer to the text boxes later on
  emailRef = React.useRef(null);
  usernameRef = React.useRef(null);
  passwordRef = React.useRef(null);
  secondPasswordRef = React.useRef(null);
  return (<>
    <Common.PageHeader/>
    <main id="mainPage">
      <a href="/chat">cat</a>
      <h1 style={headingStyles}>
        Congratulations
        <br/>
        <span>— you just made a Skill iSsue site! 🎉🎉🎉 :3</span>
      </h1>
      <p style={paragraphStyles}>
        Edit <code>src/pages/index.js</code> to see this page
        update in real-time. 😎
      </p>
      <div id="P" className="popupParent" style={{display: "flex"}} onMouseDown={()=>{return;document.getElementById('P').style.display = 'none'}}><div id="p" className="popup">
        <h2 id="lit1">Sign In</h2>
        <span id="lit2">Welcome back! If you don't already have an account <br/> please <a href="#" onClick="su()">create an account</a> instead.</span>
        <div id="loginform">
          <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
          {/* The four lines below contain a weird thing with anonymous functions, this is the only way I know of to assign the element to a variable and position it at the same time */}
          <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
          <label id="pr2">Username </label><input type="text" id="unam" className="textBox" ref={usernameRef}/>
          <label>Password </label><input type="password" id="pwd1" className="textBox" ref={passwordRef}/>
          <label id="pr1">Confirm Password </label><input type="password" id="pwd2" className="textBox" ref={secondPasswordRef}/>
          </div><br/>
          <button onClick={doTheLoginThingy} id="lit3">Sign In</button>
        </div>
      </div></div>
    </main>
    <footer>links to stuff maybe</footer>
  </>);
};

export default IndexPage;

export const Head = () => (
  <title>(Beta!) Platypuss</title>
);
