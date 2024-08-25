import React from "react";

export const PageHeader = ({title, iconClickEvent, ...props}) => {
    return (<header {...props}>
        <img onClick={iconClickEvent ? iconClickEvent : () => {window.location = "/"}} style={{cursor: "pointer"}} src="/icons/icon-48x48.png"/>
        <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
            {title ? title : "(Beta!) Platypuss"}
        </h2>
    </header>);
};