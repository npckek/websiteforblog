import React from 'react';
import {Link} from "react-router-dom";
import { nanoid } from 'nanoid'
import {initializeLocalStorage} from "../utils/initData";

const Home = () => {

    const id = nanoid(10)

    console.log(id)

    initializeLocalStorage();

    return (
        <div className="bg-cyan-800 h-lvh w-lvw flex flex-col items-center justify-center">
            <p className="text-white text-3xl m-2">
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

        </div>
    )
};

export default Home;