import React, {createRef, useState} from "react";
import './MessageForm.css';
import 'emoji-mart/css/emoji-mart.css';
import {Picker} from 'emoji-mart';


function MessageForm({chatId, userId, sendMessage}) {
    const inputRef = createRef();
    let [input, setInput] = useState("");
    let [renderEmoji, setRenderEmoji] = useState(false);

    const addEmoji = (e) => {
        let emoji = e.native;
        const cursor = inputRef.current.selectionStart;
        const text = input.slice(0, cursor) + emoji + input.slice(cursor);
        setInput(text);
        setRenderEmoji(false);
    };

    const onSubmit = () => {
        const messageText = input;
        const messageDate = new Date();
        sendMessage(messageText, messageDate, chatId, userId);
        setInput('');
    };


    return (
        <div className={'form-wrapper'}>
            <div className={'emojiWrapper'}>
                {renderEmoji && <Picker onClick={addEmoji} theme={'dark'}
                                        style={{position: 'absolute', bottom: '10px', right: '20px'}}/>}
            </div>
            <form className="message-form">
                <button type="button" className="message-form__clip-button">
                    <img src={process.env.PUBLIC_URL + '/clip.svg'}
                         alt="картинка скрепки"/>
                </button>
                <label htmlFor="messageText">
                <textarea className="message-form__text" id="messageText"
                          placeholder="Message..." cols="45" ref={inputRef} value={input}
                          onChange={(e) => setInput(e.target.value)}/>
                </label>
                <button type={'button'} onClick={() => setRenderEmoji(true)} className={'message-form__emoji'}>
                    <img src={process.env.PUBLIC_URL + "/emoji.svg"} alt="эмоджи"/>
                </button>
                <button type={'button'} className={'message-form__audiomessage'}>
                    <img src={process.env.PUBLIC_URL + "/micro.svg"} alt="микрофон" width="25"/>
                </button>
                <button onClick={onSubmit} type="button" className="message-form__submit-button">
                    <img src={process.env.PUBLIC_URL + "/right-arrow.svg"} alt="картинка со стрелочкой" width="35"/>
                </button>
            </form>
        </div>
    );
}

export default MessageForm;
