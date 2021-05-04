import React from "react";
import PropTypes from 'prop-types'
import UserItem from "./UserItem";
import './UserItemsList.css'
import axios from "axios";

import {useHistory} from "react-router-dom";

const userClickHandle = (loggedInUser, userOnClick, usersWithChats, history) => {
    const data = {
        users: [loggedInUser.id, userOnClick.id]
    };
    if (usersWithChats[userOnClick.id]) {
        const chat = usersWithChats[userOnClick.id];
        history.push(`chats/${chat.id}`)
    } else {
        axios.post('/api/v1/chats', data)
            .then(result => {
                const chat = result.data;
                history.push(`chats/${chat.id}`)
            });
    }
};

function UserItemsList({user, users, usersWithChats}) {
    const history = useHistory();

    return (
        <div className="users_block">
            {users.map((u, _) => {
                return (<UserItem onClick={() => userClickHandle(user, u, usersWithChats, history)} key={u.userName}
                                  userName={u.userName}
                                  avatarUrl={u.avatarUrl}/>)
            })}
        </div>
    )
}

UserItemsList.propTypes = {
    users: PropTypes.array
};

export default UserItemsList;