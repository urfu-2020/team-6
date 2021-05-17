import React, {useEffect, useRef} from "react";
import './MessagesList.css'
import Message from "./Message";

function MessagesList({chatId, userId, messages}) {
    return (
        <div className='messages-list'>
            {messages.map((message) =>
                <Message key={message.id} text={message.text} isYou={message.isYou}
                         avatarUrl={message.avatarUrl} date={message.date}/>)}
        </div>
    );
}

export default MessagesList;
