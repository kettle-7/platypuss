import React from "react";

export const PageHeader = ({title, iconClickEvent, states, ...props}) => {
    [states.accountInformation, states.setAccountInformation] = React.useState({});

    return (<header {...props}>
        <img className="avatar" onClick={iconClickEvent ? iconClickEvent : () => {window.location = "/"}} style={{cursor: "pointer"}} src="/icons/icon-48x48.png"/>
        <h2 onClick={() => {window.location = "/"}} style={{cursor: "pointer"}}>
            {title ? title : "(Beta!) Platypuss"}
        </h2>
        <div style={{flexGrow: 1}}></div>
        <img className="avatar" style={{cursor: "pointer"}} src={states.accountInformation.avatar}/>
    </header>);
};