import * as React from "react";
import { Link } from "gatsby";
import "./light.scss";

const NotFoundPage = () => {
  return (<>
    <header>
        <img onclick="window.location = '/'" alt="Ornithorynchus Anatinus" class="avatar" src="/icon.png"/>
        <h1 onclick="window.location = '/'" style={{cursor: 'pointer'}}>Platypuss</h1>
    </header>
    <main id="mainPage">
        <h2>Error 404</h2>
        <p>
            This page does not exist. It may have been moved, deleted or eaten by a whale.
            If a link on the website took you here please contact whoever sent you the link and let them know.
        </p>
        <Link to="/">Here's our homepage though if you're interested.</Link>
        <h6>nothing here owu</h6>
    </main>
    <footer></footer>
  </>);
};

export default NotFoundPage;

export const Head = () => <title>Page not found | Platypuss</title>;
