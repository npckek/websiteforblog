import React from "react";
import {Link} from "react-router-dom";
import GlobalEffect from "../hooks/Effect";
import Switch from "./Switcher";

const Header = () => {
    const  { currentUser, logout } = GlobalEffect();

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="p-4 flex justify-between">
            <div>
                {currentUser ? (
                    <Link to={`/user/${currentUser.name}`} className='text-text text-xl font-bold'>Мой профиль</Link>
                ) : (
                    <div className='text-text text-xl font-bold'> Добро пожаловать </div>
                )}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
                <Switch/>
            </div>
            <div>
                {currentUser ? (
                    <button
                    onClick={handleLogout}
                    className='text-text text-xl font-bold'
                    >Выйти из аккаунта</button>
                ) : (
                    <div className='flex justify-between text-text text-xl font-bold'>
                        <Link to={'/login'} className='pr-4'>Войти</Link>
                        <Link to={'/reg'}>Зарегистрироваться</Link>
                    </div>

                )}
            </div>
        </div>
    )
};


export default Header;