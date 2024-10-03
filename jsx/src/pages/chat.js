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
// °^° i am pingu

import updateCustomTheme from '../components/rgb.js';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import * as React from "react";
import "./themery.scss";

var userCache = {}; // A cache of data on users so we don't constantly have to look it up
var messageCache = {}; // The same but for messages
var states = {populated:false}; // One global variable for storing React state objects so we can access them anywhere
var openSockets = {}; // Keeps track of open websockets
var serverHashes = {}; // We can use these to get links to specific servers / maybe rooms in the future
var browser = typeof window !== "undefined"; // check if we're running in a browser rather than the build environment
var emailRef, passwordRef, confirmPasswordRef, usernameRef; // these refer to the input fields on the login popup
var finishedLoading = false; // to prevent some code from being ran multiple times
var pageUrl = browser ? new URL(window.location) : new URL("http://localhost:8000"); // window is not defined in the testing environment so just assume localhost
var authUrl = "https://platypuss.net"; // Authentication server, you shouldn't have to change this but it's a variable just in case
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
pageUrl.protocol = "https:"; // remove this in production

if (browser) window.loadedMessages = 0; // The number of messages loaded in the current view, used when loading older messages

const markdownOptions = {
  disableParsingRawHTML: true, // poses a security thread we don't need
  overrides: {
    code: SyntaxHighlightedCode
  }
};

// thanks bryc on stack overflow ^w^
function hashPassword (str, seed = 20) { // hashes things somehow
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

// Fetch data on one user, from cache if possible but from the authentication server otherwise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (userCache[id] === undefined) {
      // try fetch data from the authentication server
      fetch(authUrl+'/uinfo?id='+id).then(response => {
        // try turn the json response into an object
        response.json().then(responseObject => {
          userCache[id] = responseObject;
          resolve(responseObject);
        }).catch(()=>reject()); // if it's not valid json then reject the promise
      }).catch(()=>reject()); // same for if we can't connect to the server for some reason
    } else {
      resolve(userCache[id]); // we already know about the user so don't look them up
    }
  });
}

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
    window.location.reload();
  });
}

function SignInPopover({ error="" }) {
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

function CreateAccountPopover({ error="" }) {
  [emailRef, usernameRef, passwordRef, confirmPasswordRef] = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null)
  ];
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

function SyntaxHighlightedCode(props) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes('lang-') && hljs) {
      hljs.highlightElement(ref.current)

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute('data-highlighted')
    }
  }, [props.className, props.children])

  return <code {...props} ref={ref} />
}

function PopoverParent({...props}) {
  return (
    <div id="popoverParent" style={{
      display: "flex",
      height: states.activePopover === null ? 0 : "100%"
    }} onMouseDown={() => {setTimeout(() => {
      states.setActivePopover(null);
    }, 50)}} {...props}>{states.activePopover || <Popover style={{opacity: 0}}/>}</div>
  );
}

// for popups / popovers in desktop, render as separate screens on mobile
function Popover({children, title, style={}, ...props}) {
  return <div id="popover" style={{margin: style.margin ? style.margin : "auto", /*height: 0,*/ ...style}} onClick={event => {
    event.stopPropagation();
  }} onMouseDown={event => {
    event.stopPropagation();
  }} className={props.className ? props.className + " slideUp" : (states.activePopover ? "slideUp" : " ")} {...props}>
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

// where messages go
function MiddleSection({shown, className, ...props}) {
  const belowMessagesRef = React.useRef(null);
  const scrolledAreaRef = React.useRef(null);
  const progressBarRef = React.useRef(null);
  React.useEffect(() => {
    let scrolledArea = scrolledAreaRef.current;
    if ( // only scroll down if we're near the bottom or the page has just loaded
        (scrolledArea.scrollHeight < scrolledArea.scrollTop  + (2 * scrolledArea.clientHeight)) ||
        !finishedLoading
    ) {
      belowMessagesRef.current?.scrollIntoView({ behaviour: "smooth" });
    }
  }, [states.focusedRoomRenderedMessages]);

  return (<div id="middleSection" className={className} style={{transform: shown ? "none" : "translate(100vw, 0px)", position: shown ? undefined : "absolute"}} {...props}>
    <div id="aboveScrolledArea"></div>
    <div id="scrolledArea" ref={scrolledAreaRef}> {/* Has a scrollbar, contains load more messages button but not message typing box */}
      <div id="aboveMessageArea">
        <button id="loadMoreMessagesButton" onClick={loadMoreMessages}>Load more messages</button>
      </div>
      {Object.keys(states.servers).length ? states.servers[states.focusedServer]?.manifest?.pending ?
        <div id="messageArea" style={{position: "relative"}}>
          <div id="serverNotConnected">
            <h2>We couldn't connect to this server</h2>
            <p>
              For whatever reason we aren't able to connect to this server at the moment. This may be a problem with
              your internet connection or something on the server's side. If you can connect to other Platypuss servers
              maybe try get in touch with the server owner if possible.
              <br/><br/>
              Server Address (for troubleshooting): {states.servers[states.focusedServer].ip}
              <br/>
            </p>
            <button onClick={leaveServer}>Leave this server</button>
          </div>
        </div> :
        <div id="messageArea">{states.focusedRoomRenderedMessages.map(message => <Message message={message} key={message.id}/>)}</div> :
        <div id="messageArea" style={{position: "relative"}}>
          <div id="noServers">
            <h2>You're not in any servers!</h2>
            <p>
              You don't appear to be in any Platypuss servers at the moment. You can join one through an invite
              link or look at <a href="https://github.com/kettle-7/platypuss/wiki" target='_blank'>the wiki
              page</a> for how to host your own.<br/><br/><a href="https://platypuss.net" target='_blank'>What's Platypuss?</a>
            </p>
          </div>
        </div>}
      <div id="belowMessageArea" ref={belowMessagesRef}></div>
    </div>
    <div style={{height:5,background:"linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3))"}}></div>
    <div id="messageGradientArea">
      <div id="showReplyingMessage" hidden={!states.reply}>
        <div className='horizontalbox'>
          <h3 style={{margin: 3}}>Replying to <strong>
            {userCache[messageCache[states.reply]?.author]?.username}
          </strong></h3>
          <div style={{flexGrow: 1}}></div>
          <button className='material-symbols-outlined' onClick={() => {setTimeout(() => {
            states.setReply(null);
          }, 50)}} style={{
            height: "fit-content",
            width: "fit-content",
            padding: 3,
            margin: 3
          }}>close</button>
        </div>
        <blockquote><Markdown options={markdownOptions}>{messageCache[states.reply]?.content}</Markdown></blockquote>
      </div>
      <span hidden={states.uploads.length === 0}>Attackments: (Click on a file to delete it)</span>
      <div id="showFiles" hidden={states.uploads.length == 0}>
        {states.uploads.map(upload => (
          <img src={upload.thumbnail} className='avatar material-symbols-outlined' onClick={() => {
            let newUploads = [];
            for (let newUpload of states.uploads) {
              if (upload !== newUpload) {
                newUploads.push(newUpload);
              }
            }
            setTimeout(() => states.setUploads(newUploads), 50);
          }} style={{borderRadius: "50%"}} alt="draft"/>
        ))}
      </div>
      <div id="progressBarContainer" hidden={states.uploadProgress == null}>
        <div id="progressBar" ref={progressBarRef} style={{
          left: `${100-states.uploadProgress}%`
        }}></div>
      </div>
      <div id="belowScrolledArea">
        <div contentEditable id="messageBox" onKeyDown={event=>{
          if (event.key === "Enter" && !states.useMobileUI && !event.shiftKey) {
            triggerMessageSend();
            event.preventDefault();
          }
        }}></div>
        <button className="material-symbols-outlined" onClick={() => {
          let input = document.createElement('input');
          input.type = "file";
          input.multiple = true;
          input.onchange = event => {
            let files = event.target.files;
            let newUploads = [...states.uploads];
            for (let file of files) {
              let id = Math.random().toString().replace(/[.]/g, "");
              newUploads.push({
                id: id,
                fileObject: file,
                thumbnail: URL.createObjectURL(file)
              });
            }
            setTimeout(() => states.setUploads(newUploads), 50);
          };
          input.click();
        }}>publish</button>
        <button className="material-symbols-outlined" onClick={triggerMessageSend}>send</button>
      </div>
    </div>
  </div>);
}

// Renders a single message
function Message({message}) {
  // We might have the author cached already, if not we'll just get them later
  let [author, setAuthor] = React.useState(userCache[message.author] || {
    avatar: null,
    username: "Deleted User"
  });
  let sentByThisUser = message.author === states.accountInformation.id;
  let uploads = message.uploads ? message.uploads : [];
  let messageContent = message.content;
  let touchTimer;
  fetchUser(message.author).then(newAuthor=>{setAuthor(newAuthor)});

  let showContextMenu = () => {
    touchTimer = setTimeout(() => {
      states.setActivePopover(<Popover title="">
        <div className='horizontalbox'>
          <button className='material-symbols-outlined' style={{display:(
            sentByThisUser ? !states.focusedServerPermissions.includes("message.edit")
            : true // You shouldn't be able to edit other people's messages no matter what
          ) ? "none" : "flex"}}>Edit</button>
          <button className='material-symbols-outlined' onClick={()=>{replyToMessage(message.id)}}>Reply</button>
          <button className='material-symbols-outlined' onClick={()=>{pingUser(message.author)}}>alternate_email</button>
          <button className='material-symbols-outlined' onClick={()=>{deleteMessage(message.id)}} style={{diplay: (
            sentByThisUser ? !states.focusedServerPermissions.includes("message.delete")
            : !states.focusedServerPermissions.includes("moderation.delete")
          ) ? "none" : "flex"}}>Delete</button>
        </div>
        <div className="messageAuthor" style={{ display: message.special ? "none" : "flex" }}>
          <h3 className="messageUsernameDisplay">{author.username}</h3>
          <span className="messageTimestamp">@{author.tag} at {message.timestamp ? new Date(message.timestamp).toLocaleString() : new Date(message.stamp).toLocaleString()}</span>
        </div>
        {message.reply ? messageCache[message.reply] ? <blockquote className='messageReply'>
          <span className='ping'>@{userCache[messageCache[message.reply].author]?.username} </span>
          <span className='messageReplyContent'>{messageCache[message.reply]?.content}</span>
        </blockquote> : <blockquote className='messageReply'><em>Message couldn't be loaded</em></blockquote> : ""}
        <div className="messageContent">
          <Markdown options={markdownOptions}>{messageContent}</Markdown>
          <div className='horizontalbox'>
            {uploads.map(upload => <img className="upload" src={"https://"+states.servers[states.focusedServer].ip+upload.url} onClick={() => {setTimeout(() => {
              states.setActivePopover(<Popover className="imagePopover" style={{backgroundColor: "transparent", background: "transparent", boxShadow: "none", width: "auto"}} title={upload.name}>
                <img src={"https://"+states.servers[states.focusedServer].ip+upload.url} style={{borderRadius: 10, boxShadow: "0px 0px 10px black"}}/>
                <a href={"https://"+states.servers[states.focusedServer].ip+upload.url} style={{color: "white"}}>Download this image</a>
              </Popover>);
            }, 50);}}/>)}
          </div>
        </div>
      </Popover>);
    }, 750);
  }

  return (<div className="message1" id={message.id} onTouchStart={states.useMobileUI ? showContextMenu : null}
      onMouseDown={states.useMobileUI ? showContextMenu : null} onTouchEnd={states.useMobileUI ? () => {
        if (touchTimer) clearTimeout(touchTimer);
      } : null} onTouchMove={states.useMobileUI ? () => {
        if (touchTimer) clearTimeout(touchTimer);
      } : null} onMouseOut={states.useMobileUI ? () => {
        if (touchTimer) clearTimeout(touchTimer);
      } : null} onMouseUp={states.useMobileUI ? () => {
        if (touchTimer) clearTimeout(touchTimer);
      } : null}>
    <img src={author.avatar ? authUrl+author.avatar :
      "https://img.freepik.com/premium-vector/hand-drawn-cartoon-doodle-skull-funny-cartoon-skull-isolated-white-background_217204-944.jpg"
    } alt="🐙" className="avatar" style={{
      height: message.special ? "0px" : undefined
    }} onClick={() => {setTimeout(() => {
      showUser(message.author);
    }, 50);}}/>
    <div className="message2">
      <div className="messageAuthor" style={{ display: message.special ? "none" : "flex" }}>
        <h3 className="messageUsernameDisplay">{author.username}</h3>
        <span className="messageTimestamp">@{author.tag} at {message.timestamp ? new Date(message.timestamp).toLocaleString() : new Date(message.stamp).toLocaleString()}</span>
      </div>
      {message.reply ? messageCache[message.reply] ? <blockquote className='messageReply'>
        <span className='ping'>@{userCache[messageCache[message.reply].author]?.username} </span>
        <span className='messageReplyContent'>{messageCache[message.reply]?.content}</span>
      </blockquote> : <blockquote className='messageReply'><em>Message couldn't be loaded</em></blockquote> : ""}
      <div className="messageContent">
        <Markdown options={markdownOptions}>{messageContent}</Markdown>
        <div className='horizontalbox'>
          {uploads.map(upload => <img className="upload" src={"https://"+states.servers[states.focusedServer].ip+upload.url} onClick={() => {setTimeout(() => {
            states.setActivePopover(<Popover className="imagePopover" style={{backgroundColor: "transparent", background: "transparent", boxShadow: "none", width: "auto"}} title={upload.name}>
              <img src={"https://"+states.servers[states.focusedServer].ip+upload.url} style={{borderRadius: 10, boxShadow: "0px 0px 10px black"}}/>
              <a href={"https://"+states.servers[states.focusedServer].ip+upload.url} style={{color: "white"}}>Download this image</a>
            </Popover>);
          }, 50);}}/>)}
        </div>
      </div>
    </div>
    {states.useMobileUI ? "" : <div className="message3">
      <button className='material-symbols-outlined' style={{display:(
        sentByThisUser ? !states.focusedServerPermissions.includes("message.edit")
        : true // You shouldn't be able to edit other people's messages no matter what
      ) ? "none" : "flex"}}>Edit</button>
      <button className='material-symbols-outlined' onClick={()=>{replyToMessage(message.id)}}>Reply</button>
      <button className='material-symbols-outlined' onClick={()=>{pingUser(message.author)}}>alternate_email</button>
      <button className='material-symbols-outlined' onClick={()=>{deleteMessage(message.id)}} style={{diplay: (
        sentByThisUser ? !states.focusedServerPermissions.includes("message.delete")
        : !states.focusedServerPermissions.includes("moderation.delete")
      ) ? "none" : "flex"}}>Delete</button>
    </div>}
  </div>);
}

function triggerMessageSend() {
  let socket = openSockets[states.focusedServer];
  let messageTextBox = document.getElementById("messageBox");
  if (states.uploads.length === 0) {
    socket.send(JSON.stringify({
      eventType: "message",
      message: {
        content: messageTextBox.innerText,
        room: states.focusedRoom.id,
        reply: states.reply ? states.reply : undefined
      }
    }));
    if (!states.focusedRoomRenderedMessages[0]) {
      setTimeout(loadView, 50);
    }
    messageTextBox.innerHTML = "";
    setTimeout(() => {
      states.setReply(null);
      states.setUploads([]);
    }, 50);
  } else {
    let remainingUploads = 0;
    let attachmentObjects = [];
    for (let upload of states.uploads) {
      remainingUploads++;
      // fetch still doesn't support progress tracking which sucks so we use xmlhttprequest
      let request = new XMLHttpRequest();
      request.open("POST", `https://${states.servers[states.focusedServer].ip}/upload?sessionID=${states.servers[states.focusedServer].token}&mimeType=${upload.fileObject.type}&fileName=${upload.fileObject.name.replace(/[ \\\/]/g, "_")}`);
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status) {
          remainingUploads--;
          try {
            let responseObject = JSON.parse(request.responseText);
            attachmentObjects.push(responseObject);
            if (remainingUploads === 0) {
              states.setUploadProgress(null);
              socket.send(JSON.stringify({
                eventType: "message",
                message: {
                  content: messageTextBox.innerText,
                  room: states.focusedRoom.id,
                  reply: states.reply ? states.reply : undefined,
                  uploads: attachmentObjects
                }
              }));
              if (!states.focusedRoomRenderedMessages[0]) {
                setTimeout(loadView, 50);
              }
              messageTextBox.innerHTML = "";
              setTimeout(() => {
                states.setReply(null);
                states.setUploads([]);
              }, 50);
            }
          } catch (error) {
            states.setActivePopover(<Popover>
              <span>We encountered an unknown error. Please report it as a bug if you can. Error message:</span>
              <pre><code>{error.toString()}</code></pre>
              <br/><span>Server response text:</span>
              <pre><code>{request.responseText}</code></pre>
            </Popover>);
          }
        }
      };
      request.upload.onprogress = (event) => {
        states.setUploadProgress(event.loaded/event.total*100);
      };
      request.send(upload.fileObject);
    }
  }
}

async function showUser(id) {
  let user = await fetchUser(id);
  states.setActivePopover(<Popover title="">
    <div className='popoverBanner'>
      <img className='avatar bannerIcon' alt="🐙" src={authUrl+user.avatar}/>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingLeft: 5
      }}>
        <span style={{display:"flex", alignItems: "center"}}><h2 style={{margin: 0, marginRight: 5}}>{user.username}</h2>@{user.tag}</span>
        <h6 style={{margin: 0}}>ID: {id}</h6>
      </div>
    </div>
    <div id="userAboutText"><Markdown options={markdownOptions}>{user.aboutMe.text}</Markdown></div>
    <div style={{flexGrow: 1}}/>
    <button onClick={() => {setTimeout(() => {states.setActivePopover(null)}, 50);}}>Done</button>
  </Popover>);
}

// A SLIGHTLY DIFFERENT COMMENT
function RoomsBar({shown, className, ...props}) {
  let roomNameRef = React.createRef(null);
 
  return (<div className={className + " sidebar"} id="roomsBar" style={{transform: shown ? "none" : "translate(-100vw, 0px)", position: shown ? undefined : "absolute", padding: shown ? 5 : 0}} {...props}>
    <div id="serverTitle" style={{cursor: "pointer", backgroundImage: states.focusedServer ? states.servers[states.focusedServer].manifest.icon : ""}}>
    <h3 style={{margin: 5}}>
      {states.focusedServer ? states.servers[states.focusedServer].manifest.title : "Loading servers..."}
    </h3>
    <div style={{flexGrow: 1}}></div>
    {(states.focusedServerPermissions.includes("room.add") || states.focusedServerPermissions.includes("admin")) && 
      <button className="material-symbols-outlined" style={{
        height: "fit-content",
        width: "fit-content",
        padding: 3,
        margin: 3
      }} onClick={() => {setTimeout(() => {
        states.setActivePopover(<Popover title="New Room">
          <div className='horizontalbox'>
            <label htmlFor="roomNameBox">Room name: </label>
            <input type='text' placeholder='' id="roomNameBox" ref={roomNameRef}/>
          </div>
          <button onClick={() => {
            openSockets[states.focusedServer].send(JSON.stringify({
              eventType: "createRoom",
              name: roomNameRef.current.value
            }));
            setTimeout(() => {states.setActivePopover(null);}, 50);
          }}>Create</button>
          <button onClick={() => setTimeout(() => {
            states.setActivePopover(null);
          }, 50)}>Cancel</button>
        </Popover>);
      }, 50);}}>
        add
    </button>}
    <button className="material-symbols-outlined" style={{
      height: "fit-content",
      width: "fit-content",
      padding: 3,
      margin: 3
    }} onClick={() => {setTimeout(() => {
      states.setActivePopover(<Popover title="">
        <div className='popoverBanner'>
          <img className='avatar bannerIcon' alt="🐙" src={states.servers[states.focusedServer].manifest.icon}/>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingLeft: 5
          }}>
            <h1 style={{margin: 0}}>{states.servers[states.focusedServer].manifest.title}</h1>
            <p style={{margin: 0}}>IP address: {states.servers[states.focusedServer].ip}
            <br/>{states.servers[states.focusedServer].manifest.memberCount} members</p>
          </div>
        </div>
        <div><Markdown options={markdownOptions}>{states.servers[states.focusedServer].manifest.description}</Markdown></div>
        <div style={{flexGrow: 1}}/>
        <button onClick={leaveServer}>Leave this server</button>
      </Popover>);
    }, 50);}}>stat_minus_1</button></div>
    {Object.values(states.focusedServerRenderedRooms).map(room => (<RoomLink room={room}></RoomLink>))}
    {Object.values(states.focusedServerRenderedRooms).length === 0 ? <p>This server doesn't have any rooms in it.</p> : <></>}
  </div>);
}

function leaveServer() {
  fetch(`${authUrl}/leaveServer?id=${localStorage.getItem("sessionID")}&ip=${
    states.servers[states.focusedServer].ip} ${
    states.servers[states.focusedServer].inviteCode} ${
    states.servers[states.focusedServer].subserver}`).then(() => {window.location.reload()});
}

function RoomSettingsPopover({room}) {
  let roomNameRef = React.useRef(null);
  let roomDescriptionRef = React.useRef(null);

  React.useEffect(() => {
    if (roomNameRef.current)
      roomNameRef.current.value = room.name;
    if (roomDescriptionRef.current)
      roomDescriptionRef.current.innerText = room.description;
  }, []);
  return <>
    <div className='horizontalbox'>
      <label htmlFor="editRoomName">Room name: </label>
      <input type="text" id="editRoomName" ref={roomNameRef}/>
    </div>
    <h5>Room description:</h5>
    <div id="roomDescription" contentEditable={(
      states.focusedServerPermissions.includes("room.edit") ||
      states.focusedServerPermissions.includes("admin")
    )} ref={roomDescriptionRef}/>
    {(states.focusedServerPermissions.includes("room.delete") ||
      states.focusedServerPermissions.includes("admin")) ? <button onClick={() => {
      setTimeout(() => {
        states.setActivePopover(<Popover title={"Do you really want to delete "+room.name+"?"}>
          <button onClick={() => {
            openSockets[states.focusedServer].send(JSON.stringify({
              eventType: "deleteRoom",
              roomID: room.id
            }));
            setTimeout(() => {
              states.setActivePopover(null);
            }, 50);
          }}>Yes</button>
          <button onClick={() => {
            setTimeout(() => {
              states.setActivePopover(null);
            }, 50);
          }}>No</button>
        </Popover>);
      }, 50);
    }}>Delete Room</button> : ""}
    <button onClick={() => {setTimeout(() => {
      openSockets[states.focusedServer].send(JSON.stringify({
        eventType: "editRoom",
        operation: "rename",
        newName: roomNameRef.current.value,
        roomID: room.id
      }));
      openSockets[states.focusedServer].send(JSON.stringify({
        eventType: "editRoom",
        operation: "changeDescription",
        newDescription: roomDescriptionRef.current.innerText,
        roomID: room.id
      }));
      states.setActivePopover(null);
    }, 50);}}>Save</button>
    <button onClick={() => {setTimeout(() => {
      states.setActivePopover(null);
    }, 50);}}>Cancel</button>
  </>;
}

// a comment
function RoomLink({room}) {
  return (<div className="roomLink" style={{cursor:"pointer"}} onClick={() => {
      setTimeout(() => {
        states.setFocusedRoom(room);
        states.setMobileSidebarShown(false);
        loadView();
      }, 50);
    }}>
    <a>{room.name}</a>
    <button className="roomSettings material-symbols-outlined" style={{
      height: "fit-content",
      width: "fit-content",
      padding: 3,
      margin: 3
    }} onClick={event => {
      event.stopPropagation();
      setTimeout(() => {
        states.setActivePopover(<Popover title="Room Settings"><RoomSettingsPopover room={room}/></Popover>);
      }, 50);
    }}>settings</button>
  </div>);
}

// The bar on the left showing the servers you're in, also for navigation
function ServersBar({shown, className, ...props}) {
  return (<div className={className + " sidebar"} id="serversBar" style={{transform: shown ? "none" : "translate(-100vw, 0px)", position: shown ? undefined : "absolute"}} {...props}>
    <button className="serverIcon material-symbols-outlined" id="newServerButton">add</button>
    {Object.values(states.servers).map(server => (<ServerIcon server={server}></ServerIcon>))}
  </div>);
}

// a server icon button thing
function ServerIcon({server}) {
  [server.manifest, server.setManifest] = React.useState({
    icon: "",
    title: "Couldn't connect to this server 🐙",
    pending: true
  });
  return (<div className="tooltipContainer">
    <img className="serverIcon" src={server.manifest.icon} alt="🐙" onClick={()=>{setTimeout(()=>{
      states.setFocusedServer(server.serverCode);
      loadView(server.serverCode);
    }, 50)}}/>
    <div className="serverIconTooltip">{server.manifest.title}</div>
  </div>);
}

// The bar on the right showing other server members
function PeersBar({shown, className, ...props}) {
  return (<div className={className + " sidebar"} id="peersBar" style={{right: 0, transform: shown ? undefined : "translate(-100vw, 0px)", position: shown ? undefined : "absolute"}} {...props}>
    <button className="serverIcon material-symbols-outlined" id="inviteButton" onClick={() => {
      openSockets[states.focusedServer].send(JSON.stringify({
        eventType: "message",
        message: {
          content: "/invite",
          room: states.focusedRoom.id
        }
      }));
    }}>add</button>
    {Object.values(states.focusedServerPeers).map(peer =>
      <PeerIcon peer={peer}/>
    )}
  </div>);
}

function PeerIcon({peer}) {
  let [peerInfo, setPeerInfo] = React.useState(userCache[peer.id] || {avatar:"/icon.png"});
  fetchUser(peer.id).then(setPeerInfo);
  return (<img src={authUrl+peerInfo.avatar} className="serverIcon avatar" alt="🐙" style={{
    opacity: peer.online ? 1 : 0.5
  }} onClick={() => {setTimeout(() => {showUser(peer.id)}, 50);}}/>);
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
            setTimeout(async function() {
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
            }, 50);
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
        userCache[states.accountInformation.id].aboutMe.text = aboutMeRef.current.innerText;
        let newAccountInformation = {...states.accountInformation};
        newAccountInformation.aboutMe.text = aboutMeRef.current.innerText;
        states.setAccountInformation(newAccountInformation);
      }}/>
      <div className='horizontalbox'>
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
      <button onClick={() => {setTimeout(() => {states.setActivePopover(null);}, 50);}}>Done</button>
    </>
  );
}

function loadMoreMessages() {
  openSockets[states.focusedServer].send(JSON.stringify({
    eventType: "messageLoad",
    start: window.loadedMessages,
    room: states.focusedRoom.id,
    max: 100
  }));
}

// The document head contains metadata, most of it is defined in use-site-metadata.jsx
export const Head = () => (
  <title>(Beta!) Platypuss</title>
);

// Send a packet to delete a message
function deleteMessage(id) {
  openSockets[states.focusedServer].send(JSON.stringify({
    eventType: "messageDelete",
    room: states.focusedRoom.id,
    id: id
  }));
}

// Make the next message a reply to the said message
function replyToMessage(id) {
  setTimeout(()=>{states.setReply(id)}, 50);
}

// Add ping text for the specified user to the message box
function pingUser(id) {
  document.getElementById("messageBox").innerText += "[@" + id + "]";
}

function showInvitePopup(invite, domain) {
  // thing
  let ip = [ // the first 8 characters are the ip address in hex form
    Number("0x"+invite[0]+invite[1]).toString(),
    Number("0x"+invite[2]+invite[3]).toString(),
    Number("0x"+invite[4]+invite[5]).toString(),
    Number("0x"+invite[6]+invite[7]).toString()].join(".");
  let subserver = ip;
  if (domain !== null) {
    ip = domain;
  }
  let port = 0;
  for (let c = 8; c + 2 < invite.length; c++) {
    port = port * 16 + parseInt(invite[c], 16);
  }
  pageUrl.searchParams.delete("invite");
  let code = Number("0x"+invite[invite.length - 2]+invite[invite.length - 1]).toString();
  fetch(`http${pageUrl.protocol === "http:" ? "" : "s"}://${ip}:${port}/${subserver}`).then(res => res.json()).then(data => {
    states.setActivePopover(
      <Popover title={"You've been invited to join "+(data.title ? data.title.toString() : "an untitled server")}>
        <div className='popoverBanner'>
          <img className='avatar bannerIcon' alt="🐙" src={data.icon}/>
          <p>IP address: {ip}:{port}
          <br/>{data.memberCount} members</p>
        </div>
        <div style={{border: "1px solid var(--grey)",padding:3}}><Markdown options={markdownOptions}>{data.description}</Markdown></div>
        <div style={{flexGrow: 1}}/>
        <button onClick={() => {
          if (states.accountInformation.username) {
            fetch(authUrl+`/joinServer?id=${localStorage.getItem("sessionID")}&ip=${ip}:${port}+${code}+${subserver}`).then(() => {
              window.location = "/chat";
            }).catch(error => {
              states.setActivePopover(
                <Popover title="Couldn't join the server">
                  <p>We don't know why this happened but you might be able to try reload the page.<br/>
                  Here's an error message:<br/><code>{error.toString()}</code></p>
                </Popover>
              );
            });
          } else {
            states.setActivePopover(<Popover title="Create Account"><CreateAccountPopover/></Popover>);
          }
        }}>Accept</button>
        <button onClick={() => {window.location = states.accountInformation.username ? "/chat" : "/"}}>Decline</button>
      </Popover>
    );
  }).catch(error => {
    states.setActivePopover(
      <Popover title="You were invited to join a server but we couldn't connect.">
        <div className='popoverBanner'>
          <img className='avatar bannerIcon' alt="🐙"/>
          <p>IP address: {ip}:{port}
          <br/>Error message: <code>{error.toString()}</code></p>
        </div>
        <div style={{flexGrow: 1}}/>
        {/*<button>Accept Anyway</button>*/}
        <button onClick={() => {window.location = '/chat'}}>Close</button>
      </Popover>
    );
  });
}

async function loadView(switchToServer) {
  // don't try load the client as part of the page compiling
  if (!browser) return;
  window.onkeydown = event => {
    if (event.key === "Escape") {
      states.setActivePopover(null);
    }
  };
  let isInvite = false;
  if (pageUrl.searchParams.has("invite")) {
    isInvite = true;
    showInvitePopup(pageUrl.searchParams.get("invite"), pageUrl.searchParams.get("ip"));
  }

  // delete all messages
  states.setFocusedRoomRenderedMessages([]);
  window.loadedMessages = 0;
  finishedLoading = false;
  updateCustomTheme(states.themeHex, states);
  // connect to the authentication server to get the list of server's we're in and their session tokens
  fetch(`${authUrl}/getServerTokens?id=${localStorage.getItem("sessionID")}`).then(data => data.json()).then(async function(data) {
    for (let socket of Object.values(openSockets)) {
      socket.close();
    }
    for (let serverName in data.servers) { // this for loop lets us keep the same server focused between reloads
      serverHashes[serverName] = hashPassword(serverName); // it's not a password but who cares
      if (window.location.toString().replace(/^.*\#/g, "") === serverHashes[serverName] && !switchToServer) {
        states.setFocusedServer(serverName);
      }
    }
    let servers = {};
    for (let serverCode in data.servers) {
      let splitServerCode = serverCode.split(' '); // take the data the authentication server gives us about the server and use it to connect
      let ip = splitServerCode[0];
      let inviteCode = splitServerCode[1];
      let subserver = splitServerCode[2];
      servers[serverCode] = { // add this server to our list of servers, making an icon
        ip: ip,
        token: data.servers[serverCode],
        serverCode: serverCode,
        inviteCode: inviteCode,
        subserver: subserver,
        manifest: { // we haven't actually heard from the server itself what its icon, name etc are
          title: "Loading",
          icon: "/icon.png",
          memberCount: 0,
          public: false,
          description: "Waiting for a response from the server",
          pending: true
        }
      };
      // Open a socket connection with the server
      let socket = new WebSocket((pageUrl.protocol === "https:" ? "wss:" : "ws:") + "//" + ip);

      socket.onerror = () => {
        // The server's disconnected, in which case if we're focusing on it we should focus on a different server
        console.error(`Warning: couldn't connect to ${ip}, try check your internet connection or inform the owner(s) of the server.`);
        if (states.focusedServer === serverCode) {
          // window.location.reload();
        }
      };

      socket.onopen = () => { // Send a login packet to the server once the connection is made
        openSockets[serverCode] = socket;
        socket.send(JSON.stringify({
          eventType: "login",
          subserver: subserver,
          inviteCode: inviteCode,
          sessionID: data.servers[serverCode]
        }));
        if (!states.servers[states.focusedServer]) {
          if (states.servers[switchToServer]) {
            states.setFocusedServer(switchToServer);
          } else {
            states.setFocusedServer(serverCode);
          }
        }
        if (states.focusedServer === serverCode) {
          window.history.pushState({}, "", "#"+serverHashes[serverCode]);
        }
      };

      socket.onclose = () => {
        // same as onerror above
        console.error(`Warning, the server at ${ip} closed.`);
        if (states.focusedServer === serverCode) {
          // window.location.reload();
        }
      };

      socket.onmessage = async event => {
        let packet = JSON.parse(event.data);
        switch (packet.eventType) {
          case "message":
            if (document.visibilityState == "hidden" && data.userId !== packet.message.author)
              new Audio(authUrl+'/randomsand.wav').play();
            if (states.focusedServer !== serverCode) break;
            // cache the message and add it to the list to render
            messageCache[packet.message.id] = packet.message;
            states.setFocusedRoomRenderedMessages([
              ...states.focusedRoomRenderedMessages,
              messageCache[packet.message.id]
            ]);
            window.loadedMessages++;
            break;
          case "messages":
            if (states.focusedServer !== serverCode || states.focusedRoom.id != packet.room) break;
            if (packet.messages[0])
            for (let messageID in packet.messages) {
              packet.messages[messageID].isHistoric = true; // whether it was sent before we loaded the page
              messageCache[packet.messages[messageID].id] = {...packet.messages[messageID]};
            }
            states.setFocusedRoomRenderedMessages([
              ...packet.messages,
              ...states.focusedRoomRenderedMessages
            ]);
            window.loadedMessages += packet.messages.length;
            setTimeout(() => { finishedLoading = true; }, 1000);
            break;
          case "messageDeleted":
            if (!messageCache[packet.messageId]) break;
            document.getElementById(packet.messageId).remove();
            delete messageCache[packet.messageId];
            break;
          case "roomAdded":
          case "roomEdited":
          case "roomDeleted":
            if (serverCode === states.focusedServer) {
              states.setFocusedServerRenderedRooms(packet.newRooms ? packet.newRooms : states.focusedServerRenderedRooms);
              if (!Object.keys(packet.newRooms).includes(states.focusedRoom.id)) {
                states.setFocusedRoom(Object.values(packet.newRooms)[0]);
                loadView();
              }
            }
            break;
          case "connected":
            if (servers[serverCode].setManifest)
              servers[serverCode].setManifest(packet.manifest);
            else 
              servers[serverCode].manifest = packet.manifest;
            if (serverCode === states.focusedServer) {
              if (packet.isAdmin) packet.permissions.push("admin");
              states.setFocusedServerPermissions(packet.permissions);
              states.setFocusedServerRenderedRooms(packet.rooms ? packet.rooms : {});
              states.setFocusedServerPeers(packet.peers);
              let roomToFocus = states.focusedRoom;
              if (packet.rooms) {
                if (!Object.keys(packet.rooms).includes(states.focusedRoom.id)) {
                  roomToFocus = Object.values(packet.rooms)[0];
                  states.setFocusedRoom(roomToFocus);
                }
                socket.send(JSON.stringify({
                  eventType: "messageLoad",
                  start: 0,
                  room: roomToFocus.id,
                  max: 50
                }));
              }
            }
            break;
          case "rateLimit":
            setTimeout(() => {
              socket.send(JSON.stringify(packet.repeatedPacket));
            }, packet.delay);
            break;
          case "connecting":
          case "disconnect":
          case "join":
            break; // we don't care about these
          default:
            if ("explanation" in packet && states.focusedServer === serverCode && states.focusedRoom.id == packet.room) {
              let randomString = Math.random().toString();
              messageCache[randomString] = {
                special: true,
                author: null,
                content: packet.explanation.toString(),
                id: randomString
              };
              states.setFocusedRoomRenderedMessages([
                ...states.focusedRoomRenderedMessages,
                messageCache[randomString]
              ]);
            }
            console.log(packet.explanation);
            break;
        }
      };
    }
    // update our list of servers and if no server is currently focused pick the first one
    states.setServers(servers);
  }).catch(error => {
    if (!isInvite) {
      // if something is wrong then i want to be able to test it but otherwise people are probably logged out and therefore should be redirected to the homepage
      if (pageUrl.hostname.includes("localhost")) {
        states.setActivePopover(<Popover title="client loading error">
          <pre><code>{error.toString()}</code></pre>
          <span>You probably need to <a onClick={() => {
            states.setActivePopover(<Popover title="Sign In"><SignInPopover/></Popover>)
          }} href="#">sign in</a></span>
        </Popover>);
      } else {
        window.location = "/";
      }
    }
  });
}

function PageHeader ({title, iconClickEvent, ...props}) {
  [states.accountInformation, states.setAccountInformation] = React.useState({});

  React.useEffect(() => {
    fetch(authUrl + "/uinfo?id=" + localStorage.getItem("sessionID"))
      .then(data => data.json())
      .then(data => states.setAccountInformation(data))
      .catch(() => { if (pageUrl.pathname === "/chat") window.location = "/" });
  }, []);

  return (<header {...props}>
    {states.useMobileUI ?
      <button className="avatar material-symbols-outlined" onClick={
        iconClickEvent ? iconClickEvent : () => {window.location = "/"}
      } style={{cursor: "pointer", border: "none"}}>menu</button> : 
      <img className="avatar material-symbols-outlined" alt="menu" onClick={
        iconClickEvent ? iconClickEvent : () => {window.location = "/"}
      } style={{cursor: "pointer"}} src="/icons/icon-96x96.png"/>}
    <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
        {title ? title : "(Beta!) Platypuss"}
    </h2>
    <div style={{flexGrow: 1}}></div>
    <img className="avatar" style={{cursor: "pointer", display: Object.keys(states.accountInformation).length ? "flex" : "none"}} src={authUrl+states.accountInformation.avatar} onClick={() => {
      setTimeout(() => {states.setActivePopover(<Popover title="Account Settings"><AccountSettings/></Popover>);}, 50);
    }}/>
  </header>);
};

function fileDrop(event) {
  // balaaaaaa
}

// Renders the page
export default function ChatPage() {
  let theme = "medium";
  let themeHex = "000000";
  if (browser && !states.hasRendered) {
    window.addEventListener("dragenter", () => {}, false);
    window.addEventListener("dragover", () => {}, false);
    window.addEventListener("drop", fileDrop, false);

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

  // set a bunch of empty React state objects for stuff that needs to be accessed throughout the program
  [states.activePopover, states.setActivePopover] = React.useState(null);
  [states.servers, states.setServers] = React.useState({}); // Data related to servers the user is in
  [states.focusedServerPermissions, states.setFocusedServerPermissions] = React.useState([]); // what permissions we have in the currently focused server
  [states.focusedRoomRenderedMessages, states.setFocusedRoomRenderedMessages] = React.useState([]); // The <Message/> elements shown in the view, set in ChatPage
  [states.focusedServer, states.setFocusedServer] = React.useState(null); // An object representing the currently focused server
  [states.focusedRoom, states.setFocusedRoom] = React.useState({}); // An object representing the currently focused room
  [states.focusedServerRenderedRooms, states.setFocusedServerRenderedRooms] = React.useState([]); // The <RoomLink/> elements in the sidebar for this server
  [states.mobileSidebarShown, states.setMobileSidebarShown] = React.useState(false); // whether to show the sidebar on mobile devices, is open by default when you load the page
  [states.useMobileUI, states.setUseMobileUI] = React.useState(browser ? (window.innerWidth * 2.54 / 96) < 20 : false); // Use mobile UI if the screen is less than 20cm wide
  [states.focusedServerPeers, states.setFocusedServerPeers] = React.useState({}); // other people in this server
  [states.theme, states.setTheme] = React.useState(theme); // what theme we're using
  [states.themeHex, states.setThemeHex] = React.useState(themeHex); // hex colour code of our custom theme
  [states.reply, states.setReply] = React.useState(null); // id of the message we're replying to
  [states.uploads, states.setUploads] = React.useState([]); // files we want to attach to the next message
  [states.uploadProgress, states.setUploadProgress] = React.useState(null); // progress bar for uploading message attachments
  [states.avatarProgress, states.setAvatarProgress] = React.useState(null); // how far through we are uploading our avatar

  React.useEffect(() => {
    loadView();
    states.setMobileSidebarShown(true);
  }, []);

  // return the basic page layout
  return (<>
    <PageHeader className={
      states.theme === "custom" ? "" :
      states.theme === "green" ? "greenThemed" :
      states.theme === "light" ? "lightThemed" :
      "darkThemed"
    } iconClickEvent={() => {
      if (states.useMobileUI) {
        setTimeout(() => {
          if (states.mobileSidebarShown)
            states.setMobileSidebarShown(false);
          else
            states.setMobileSidebarShown(true);
        }, 50);
      } else {
        window.location = "/";
      }
    }} states={states}/>
    <main>
      <div id="chatPage" className={
          states.theme === "custom" ? "" :
          states.theme === "green" ? "greenThemed" :
          states.theme === "light" ? "lightThemed" :
          "darkThemed"
        }>
        <ServersBar className={
          states.theme === "custom" ? "" :
          states.theme === "green" ? "greenThemed" :
          states.theme === "light" ? "lightThemed" :
          "darkThemed"
        } shown={states.mobileSidebarShown || !states.useMobileUI}/>
        <RoomsBar className={
          states.theme === "custom" ? "" :
          states.theme === "green" ? "greenThemed" :
          states.theme === "light" ? "lightThemed" :
          "darkThemed"
        } shown={states.mobileSidebarShown || !states.useMobileUI}/>
        <MiddleSection className={
          states.theme === "custom" ? "" :
          states.theme === "green" ? "greenThemed" :
          states.theme === "dark" ? "darkThemed" :
          "lightThemed"
        } shown={!states.mobileSidebarShown || !states.useMobileUI}/>
        <PeersBar className={
          states.theme === "custom" ? "" :
          states.theme === "green" ? "greenThemed" :
          states.theme === "light" ? "lightThemed" :
          "darkThemed"
        } shown={states.mobileSidebarShown || !states.useMobileUI}/>
        <PopoverParent className={
          states.theme === "custom" ? "" :
          states.theme === "green" ? "greenThemed" :
          states.theme === "dark" ? "darkThemed" :
          "lightThemed"
        }/>
      </div>
    </main>
  </>);
}
