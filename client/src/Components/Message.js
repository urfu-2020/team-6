import React from "react";
import './Message.css'

function Message({text, date, avatarUrl, isYou}) {
    return (
        <div className={isYou ? 'message you-message' : 'message other-message'}>
            <img className="chatImage" src={avatarUrl} alt=''/>
            <div className='message-text'>{text}</div>
            <div className='message-time'>{date}</div>
        </div>
    );
}

export default Message;