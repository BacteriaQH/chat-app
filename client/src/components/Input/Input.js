import React from "react";

import "./Input.css";


const Input = ({message, setMessage, sendMessage}) => (
    <form className="form">
        <input
            className="input"
            type="text"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
        />
        <button className="sendButton" onClick={(event) => sendMessage(event)}>Send</button>
    </form>
);

export default Input;
