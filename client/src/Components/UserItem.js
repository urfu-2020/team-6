import React from "react";
import PropTypes from 'prop-types'
import './UserItem.css'

function UserItem({ userName, avatarUrl, onClick}) {
    return (
        <div className="user_item" onClick={onClick}>
            <div className="user_parameter">
                <div className="user_image">
                    <img className="user_photo" src={avatarUrl} alt={`${userName} avatar`}/>
                </div>
                <ul className="info_block">
                    <li className="user_info user_name">{userName}</li>
                    <li className="user_info user_online">в сети</li>
                </ul>
            </div>
            <hr className="divider"/>
        </div>
    )
}

UserItem.propTypes = {
    userName: PropTypes.string,
    avatarUrl: PropTypes.string
};

export default UserItem;