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
    <span>Welcome back! If you don't already have an<br/> account please <a href="#" onClick={() => states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover/></Popover>)}>create an account</a> instead.</span>
    <div id="loginform">
      <em id="signInErrorMessage">{error}</em>
      <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
        <label>Email address </label><input type="email" id="email" className="textBox" ref={emailRef}/>
        <label>Password </label><input type="password" id="password" className="textBox" ref={passwordRef}/>
      </div>
    </div>
    <button onClick={() => {setTimeout(() => {
      states.setActivePopover(
        <Popover title="Account Recovery">
          <span>
            Forgotten your password? No worries, we can send you an email to let you
            log in without it, and you can then change your password to something else
            through the account settings menu in the top right of this page.
          </span>
          <hr/>
          <div className='horizontalbox' style={{gap: 10}}>
            <label>Email address </label><input type="email" ref={emailRef}/>
          </div>
          <button onClick={() => {
            fetch(authUrl+"/requestAccountRecovery?accountEmailAddress="+emailRef.current.value)
              .then(response => response.text())
              .then(text => states.setActivePopover(<Popover title="Account Recovery">{text}</Popover>));
            }}>Send</button>
          <button onClick={() => {setTimeout(() => {
            states.setActivePopover(null);
          }, 50);}}>Cancel</button>
        </Popover>
      );
    }, 50);}}>Forgot Password?</button>
    <button onClick={() => doTheLoginThingy(false)}>Sign In</button>
  </>);
}

function CreateAccountPopover ({ error="" }) {
  return (<>
  <span>Welcome to Platypuss! If you already have an<br/> account please <a href="#" onClick={() => states.setActivePopover(<Popover title="Sign In"><SignInPopover/></Popover>)}>sign in</a> instead.</span>
  <br/><strong>By using Platypuss you confirm that you have<br/> read and agreed to our <a href="/legal">legal agreements</a>.</strong>
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

const Error404Page = () => {
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
      <h2>Error 404</h2>
      <p>
        This page does not exist. It may have been moved, deleted or eaten by a whale.
        If a link on the website took you here please contact whoever sent you the link and let them know.
      </p>
      <a href="/">Here's our homepage though if you're interested.</a>
      <h6>nothing here :3</h6>
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

export default Error404Page;

export const Head = () => (
  <title>Page not found | Beta Platypuss</title>
);

