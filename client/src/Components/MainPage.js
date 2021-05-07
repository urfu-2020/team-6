import React from "react";
import axios from 'axios';
import './MainPage.css'
import UserItemsList from "./UserItemsList";
import LoginButton from "./LoginButton";
import ChatPage from "./ChatPage";


function MainPage() {
    const [user, setUser] = React.useState(null);
    const [usersData, setUsersData] = React.useState({users: [], usersWithChats: {}});

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
        if (!user)
            return;
        axios.get('/api/v1/users')
            .then(result => {
                const data = result.data;
                setUsersData(data);
            })
    }, [user]);

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
                <UserItemsList user={user} users={usersData.users} usersWithChats={usersData.usersWithChats}/>
            </div>);
}

export default MainPage;