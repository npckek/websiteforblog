import React, {useCallback, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

const Register = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [subs, setSubs] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find((user) => user.email === email);
        const existingName = users.find((user) => user.name === name);
        const id = Date.now()


        if (password !== "" && password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (existingUser) {
            setError("User already exists!");
            return;
        }

        if (existingName) {
            setError("Username already taken!");
            return;
        }

        const newUser = { id, email, password, name, subs };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful!");

        setTimeout(() => {
            navigate("/login");
        }, 1500);
    }, [id, name, email, password, confirmPassword, subs, navigate]);

    return (
        <div className="max-w-sm mx-auto">
            <h2 className="text-center text-xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
                </div>
                <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
                </div>
                <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-label="Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" aria-label="Confirm">Confirm</button>
            </form>
            <Link to="/login">
                <button aria-label="Login">Already have an account?</button>
            </Link>
        </div>
    )
};

export default Register;