import React, {useEffect, useRef} from "react";
import './MessagesList.css'
import Message from "./Message";
import axios from "axios";


function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function MessagesList({chatId}) {
    const [messages, setMessages] = React.useState([]);

    useInterval(async () => {
        const result =  await axios.get(`/api/v1/chats/${chatId}/messages`);
        const messages = result.data.messages;
        setMessages(messages)
    }, 2000);

    /*React.useEffect(() => {
        axios.get(`/api/v1/chats/${chatId}/messages`)
            .then(result => {
                const messages = result.data.messages;
                setMessages(messages)
            })
            .catch(error => {
                setMessages([]);
            });
    }, [chatId]);*/

    return (
        <div className='messages-list'>
            {messages.map((message) =>
                <Message key={message.id} text={message.text} isYou={message.isYou}
                         avatarUrl={message.avatarUrl} date={message.date}/>)}
        </div>
    );
}

export default MessagesList;