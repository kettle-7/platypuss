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
import "./light.scss";

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};
const paragraphStyles = {
  marginBottom: 48,
};
const listStyles = {
  paddingLeft: 0,
};
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
};

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
};

const docLink = {
  text: "Documentation",
  url: "https://www.gatsbyjs.com/docs/",
  color: "#8954A8",
};

const badgeStyle = {
  color: "#fff",
  backgroundColor: "#088413",
  border: "1px solid #088413",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 1,
  borderRadius: 4,
  padding: "4px 6px",
  display: "inline-block",
  position: "relative",
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
};

const links = [
  {
    text: "Skill issue remedy",
    url: "https://www.gatsbyjs.com/docs/tutorial/getting-started/",
    description:
      "Ever thought your skill issue was just too fat ? Well, we've got the game for that ! Now you can make it nice and flat. Now you can put your skill issue in a cat.",
    color: "#E95800",
  },
  {
    text: "How to guide",
    url: "https://www.gatsbyjs.com/docs/how-to/",
    description:
      "You are a terrible person.",
    color: "#1099A8",
  },
  {
    text: "Reference Guides",
    url: "https://www.gatsbyjs.com/docs/reference/",
    description:
      "Nitty-gritty technical descriptions of how Skill iSsue works. Most useful when you need detailed information about Skill iSsue's APIs.",
    color: "#BC027F",
  },
  {
    text: "Conceptual Guides",
    url: "https://www.gatsbyjs.com/docs/conceptual/",
    description:
      "Big-picture explanations of higher-level Skill iSsue concepts. Most useful for building understanding of a particular topic.",
    color: "#0D96F2",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Add functionality and customize your Skill iSsue site or app with thousands of plugins built by our amazing developer community.",
    color: "#8EB814",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    description:
      "Now you're ready to show the world! Give your Skill iSsue site superpowers: Build and host on Skill iSsue Cloud. Get started for free!",
    color: "#663399",
  },
  {
    text: "skill issue",
    url: "https://platypuss.net/carp",
    badge: true,
    description:
      "CARP CARP CARP CARP CARP CARP CARP CARP CARP CARP CARP",
    color: "#e69420",
  },
];

const IndexPage = () => {
  return (<>
    <header><h2>(Beta!) Platypuss</h2></header>
    <main id="mainPage">
      <a href="/chat">cat</a>
      <h1 style={headingStyles}>
        Congratulations
        <br />
        <span>— you just made a Skill iSsue site! 🎉🎉🎉</span>
      </h1>
      <p style={paragraphStyles}>
        Edit <code>src/pages/index.js</code> to see this page
        update in real-time. 😎
      </p>
      <div id="P" class="popupParent" style={{display: "none"}} onmousedown="document.getElementById('P').style.display = 'none'"><div id="p" class="popup">
            <h2 id="lit1">Sign In</h2>
            <span id="lit2">Welcome back! If you don't already have an account <br/> please <a href="#" onclick="su()">create an account</a> instead.</span>
            <div id="loginform">
                <div style="display:grid;grid-template-columns:auto auto;">
                <label style="font-size: large;">Email address </label><input type="email" id="email" class="textBox"/>
                <label style="font-size: large;" id="pr2">Username </label><input type="text" id="unam" class="textBox"/>
                <label style="font-size: large;">Password </label><input type="password" id="pwd1" class="textBox"/>
                <label style="font-size: large;" id="pr1">Confirm Password </label><input type="password" id="pwd2" class="textBox"/>
                </div><br/>
                <button style="cursor: pointer; font-size: large;" onclick="doTheLoginThingy()" id="lit3">Sign In</button>
            </div>
        </div></div>
      <ul style={listStyles}>
        <li>
          <a
            href={`${docLink.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
          >
            {docLink.text}
          </a>
        </li>
        {links.map(link => (
          <li key={link.url} style={{ ...listItemStyles, color: link.color }}>
            <span>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
              <a
                href={`${link.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
              >
                {link.text}
              </a>
              {link.badge && (
                <span style={badgeStyle} aria-label="New Badge">
                  NEW!
                </span>
              )}
              <p style={descriptionStyle}>{link.description}</p>
            </span>
          </li>
        ))}
      </ul>
    </main>
    <footer>links to stuff maybe</footer>
  </>);
};

export default IndexPage;

export const Head = () => (
  <title>(Beta!) Platypuss</title>
);
