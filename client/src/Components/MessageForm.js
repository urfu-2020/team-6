import React, {useRef} from "react";
import './MessageForm.css'
import axios from "axios";

function MessageForm({chatId}) {
    const textRef = useRef(null);

    const onSubmit = () => {
        const messageText = textRef.current.value;
        const messageDate = new Date();
        const data = {
            text: messageText,
            date: messageDate
        };
        axios.post(`/api/v1/chats/${chatId}/messages`, data)
            .then(result => {
                const message = result.data;
                console.log(message);
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <form className="message-form">
            <button type="button" className="message-form__clip-button"><img src={process.env.PUBLIC_URL + '/clip.svg'}
                                                                             alt="картинка скрепки"/>
            </button>
            <label htmlFor="messageText">
                <textarea className="message-form__text" id="messageText"
                          placeholder="Message..." cols="45" ref={textRef}/>
            </label>
            <button onClick={onSubmit} type="submit" className="message-form__submit-button">
                <img src={process.env.PUBLIC_URL + "/right-arrow.svg"} alt="картинка со стрелочкой" width="35"/>
            </button>
        </form>
    );
}

export default MessageForm;