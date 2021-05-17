import './Header.css';
import React from "react";

const turnBack = () => {
    window.history.back();
}

function Header() {
    return (
        <header className={'header'}>
            <button type={'button'} className={'backDoor'} onClick={turnBack}>
                <img src={process.env.PUBLIC_URL + "/back.svg"} alt="вернуться назад"/>
            </button>
        </header>
    );
}

export default Header;

