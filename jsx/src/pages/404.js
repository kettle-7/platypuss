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
import { Link } from "gatsby";
import "./themery.scss";

const NotFoundPage = () => {
  return (<>
    <Common.PageHeader title="(Beta!) Platypuss" className="darkThemed"/>
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
