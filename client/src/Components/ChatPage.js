import React, {useEffect, useRef} from "react";
import './ChatPage.css'
import MessageForm from "./MessageForm";
import MessagesList from "./MessagesList";
import Header from "./Header";
import {useParams} from "react-router-dom";
import axios from "axios";


function ChatPage() {
    const {id} = useParams();

    const [user, setUser] = React.useState(null);
    const savedSocket = useRef();
    const [messages, setMessages] = React.useState([]);


    useEffect(async() => {
        const result =  await axios.get(`/api/v1/chats/${id}/messages`);
        const messages = result.data.messages;
        setMessages(messages)
    }, []);

    if (user && !savedSocket.current) {
        const userId = user.id;
        savedSocket.current = new WebSocket(`ws://localhost:3001/${userId}`);
        savedSocket.current.bufferType = "arraybuffer";
        savedSocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
        };
    }

    const sendMessage = (messageText, messageDate, chatId, userId) => {
        const data = {
            type: "sendMessage",
            text: messageText,
            date: messageDate,
            chatId: chatId,
            userId: userId
        };
        savedSocket.current.send(JSON.stringify(data));
    };

    React.useEffect(() => {
        axios.get('/profile')
            .then(result => {
                const user = result.data;
                setUser(user)
            })
            .catch(error => {
                setUser(null);
            });
    }, []);

    return (
        user && (
            <div className="ChatPage">
                <Header/>
                <MessagesList chatId={id} userId={user.id} messages={messages}/>
                <MessageForm chatId={id} userId={user.id} sendMessage={sendMessage}/>
            </div>
        )
    );
}


export default ChatPage;
