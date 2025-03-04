import React from 'react';
import {Link} from "react-router-dom";
import {initializeLocalStorage} from "../utils/initData";
import Switcher from "../components/Switcher";

const Home = () => {

    initializeLocalStorage();

    return (
        <div className="bg-background h-lvh w-lvw flex flex-col items-center justify-center">
            <p className="text-text text-3xl m-2">
                Welcome to our website!
            </p>
            <div className="flex flex-row">
                <Link to="/login" className="bg-blue-950 rounded p-2 text-white text-xl m-2">
                    Login
                </Link>
                <Link to="/reg" className="bg-blue-950 rounded p-2 text-white text-xl m-2">
                    New here?
                </Link>
                <Link to="/feed" className="bg-blue-950 rounded p-2 text-white text-xl m-2">
                    Feed
                </Link>
            </div>
            <Switcher/>

        </div>
    )
};

export default Home;