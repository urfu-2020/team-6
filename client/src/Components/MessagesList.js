import React, {useEffect, useRef} from "react";
import './MessagesList.css'
import Message from "./Message";

function MessagesList({chatId}) {
    const [messages, setMessages] = React.useState([]);
    const savedSocket = useRef();
    if (!savedSocket.current) {
        savedSocket.current = new WebSocket(`ws://localhost:3001/?chatId=${chatId}`);
        savedSocket.current.bufferType = "arraybuffer";
        savedSocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
        };
    }

    return (
        <div className='messages-list'>
            {messages.map((message) =>
                <Message key={message.id} text={message.text} isYou={message.isYou}
                         avatarUrl={message.avatarUrl} date={message.date}/>)}
        </div>
    );
}

export default MessagesList;
