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
import { Link } from "gatsby";
import "./themery.scss";

var browser = typeof window !== "undefined"; // check if we're running in a browser rather than the build environment
var pageUrl = browser ? new URL(window.location) : new URL("http://localhost:8000"); // window is not defined in the testing environment so just assume localhost
var authUrl = "https://platypuss.net";
var states = {};

function PageHeader ({title, iconClickEvent, ...props}) {
    [states.accountInformation, states.setAccountInformation] = React.useState({});

    React.useEffect(() => {
        fetch(authUrl + "/uinfo?id=" + localStorage.getItem("sessionID"))
            .then(data => data.json())
            .then(data => states.setAccountInformation(data))
            .catch(() => { if (pageUrl.pathname == "/chat") window.location = "/" });
    }, []);

    return (<header {...props}>
        <img className="avatar" onClick={iconClickEvent ? iconClickEvent : () => {window.location = "/"}} style={{cursor: "pointer"}} src="/icons/icon-48x48.png"/>
        <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
            {title ? title : "(Beta!) Platypuss"}
        </h2>
        <div style={{flexGrow: 1}}></div>
        <img className="avatar" alt="🐙" style={{cursor: "pointer"}} src={authUrl+states.accountInformation.avatar}/>
    </header>);
};

const NotFoundPage = () => {
  return (<>
    <PageHeader title="(Beta!) Platypuss" className="darkThemed" states={{}}/>
    <main id="mainPage" className="lightThemed">
        <h2>Error 404</h2>
        <p>
            This page does not exist. It may have been moved, deleted or eaten by a whale.
            If a link on the website took you here please contact whoever sent you the link and let them know.
        </p>
        <Link to="/">Here's our homepage though if you're interested.</Link>
        <h6>nothing here :3</h6>
    </main>
    <footer></footer>
  </>);
};

export default NotFoundPage;

export const Head = () => <title>Page not found | Beta Platypuss</title>;
