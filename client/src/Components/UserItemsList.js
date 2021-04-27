import React from "react";
import PropTypes from 'prop-types'
import UserItem from "./UserItem";
import './UserItemsList.css'

function UserItemsList({users}) {
    return (
        <div className="users_block">
            {users.map((user, i) => {
                return (<UserItem key={user.userName} userName={user.userName} avatarUrl={user.avatarUrl} />)
            })}
        </div>
    )
}

UserItemsList.propTypes = {
    users: PropTypes.array
};

export default UserItemsList;