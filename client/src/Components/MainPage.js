import React from "react";
import axios from 'axios';
import './MainPage.css'
import UserItemsList from "./UserItemsList";
import LoginButton from "./LoginButton";


function MainPage() {
    const [user, setUser] = React.useState(null);
    const [users, setUsers] = React.useState([]);

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

    React.useEffect(() => {
        axios.get('/api/v1/users')
            .then(result => {
                const users = result.data.users;
                setUsers(users);
            })
    }, []);

    if (!user)
        return (
            <div className="MainPage">
                <LoginButton/>
            </div>);
    else
        return (
            <div className="MainPage">
                <p>You logged in as {user.userName}</p>
                <h2>Contacts:</h2>
                <UserItemsList users={users}/>
            </div>);
}

export default MainPage;