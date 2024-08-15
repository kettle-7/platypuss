import React from "react";

export const PageHeader = ({ title }) => {
    return (<header><h2 onClick={()=>{window.location = "/"}} style={{cursor: "pointer"}}>{title ? title : "(Beta!) Platypuss"}</h2></header>);
};