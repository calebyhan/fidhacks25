import React, { useRef, useState } from 'react';
import './Signup.css';
import { createUser } from '../database';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import user_icon from './assets/person.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [cookies, setCookie] = useCookies(['user']);
    const navigate = useNavigate();
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match");
        }

        try {
        setError("");
        setLoading(true);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const userId = Math.floor(Math.random() * 10000);
        const username = email.split("@")[0];

        await createUser(userId, username, email, password);

        const newUser = {
            id: userId,
            username: username,
            email: email,
        };
        setCookie('user', newUser, { path: '/' });

        alert('Signup successful!');

        navigate('/');
        } catch (err) {
        setError(`Failed to create an account: ${err.message}`);
        }
        setLoading(false);
    }

    return (
        <div className="container">
        <div className="header">
            <div className="text">Sign up!</div>
            <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="inputs">
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" ref={emailRef} placeholder="Email address" id="email" />
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" ref={passwordRef} placeholder="Password" id="password" />
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" ref={passwordConfirmRef} placeholder="Confirm Password" id="password-confirm" />
            </div>
            <div className="submit-container">
                <button type="submit" className="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up!"}
                </button>
            </div>
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
            </div>
        </form>
        </div>
    );
}
