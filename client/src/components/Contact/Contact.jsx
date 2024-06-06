import React from "react";

function Contact(props){
    return(
        <div className="contact-heading">
            <h3>{props.name}</h3>
            <p>{props.desc}</p>
        </div>
    )
}

export default Contact;
