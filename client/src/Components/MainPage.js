import React from "react";
import axios from 'axios';
import './MainPage.css';
import UserItemsList from "./UserItemsList";
import LoginButton from "./LoginButton";

function MainPage() {
    const [user, setUser] = React.useState(null);
    const [usersData, setUsersData] = React.useState({users: [], usersWithChats: {}});
    const checked = document.getElementById('check1');

    function turnDay() {
        let users = document.getElementsByClassName('users_block')[0];
        let divider = Array.from(document.getElementsByClassName('divider'));
        if (checked.checked === true) {
            users.style.backgroundColor = '#9bb5d2';
            divider.forEach(elem => elem.style.backgroundColor = '#7a97b5');
        } else {
            users.style.backgroundColor = '#16222e';
            divider.forEach(elem => elem.style.backgroundColor = '#1e2f41');
        }
    }

    React.useEffect(() => {
        axios.get('/profile')
            .then(result => {
                const user = result.data;
                setUser(user);
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
            });
    }, [user]);

    if (!user)
        return (
            <div className={'wrapper'}>
                <div className="MainPage">
                    <LoginButton/>
                </div>
            </div>
        );
    else
        return (
            <div className={'wrapper'}>
                <div className={'toggle-btn'}>
                    <input className={'checkbox'} type={'checkbox'} onClick={turnDay} id={'check1'}/>
                    <span></span>
                </div>
                <div className="MainPage">
                    <h2 className={'logged'}>You logged in as {user.userName}</h2>
                    <h2 className={'contacts'}>Contacts:</h2>
                    <UserItemsList user={user} users={usersData.users}
                                   usersWithChats={usersData.usersWithChats}/>
                </div>
            </div>);
}

export default MainPage;
