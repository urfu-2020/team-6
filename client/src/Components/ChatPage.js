import React from "react";
import './ChatPage.css'
import MessageForm from "./MessageForm";
import MessagesList from "./MessagesList";
import {useParams} from "react-router-dom";

function ChatPage() {
    const {id} = useParams();

    return (
        <div className="ChatPage">
            <MessagesList chatId={id}/>
            <MessageForm chatId={id}/>
        </div>
    );
}


export default ChatPage;