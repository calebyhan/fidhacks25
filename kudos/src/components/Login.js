import React, { useRef, useState } from 'react';
import './Signup.css';
import { login } from '../database';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import email_icon from './assets/email.png';
import password_icon from './assets/password.png';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [cookies, setCookie] = useCookies(['user']);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
        setError("");
        setLoading(true);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const user = await login(email, password);

        if (user) {
            setCookie('user', user, { path: '/' });
            alert('Login successful!');
            navigate('/');
        } else {
            setError('Invalid email or password');
        }

        } catch (err) {
        setError(`Failed to login: ${err.message}`);
        }
        setLoading(false);
    }

    return (
        <div className="container">
        <div className="header">
            <div className="text">Login!</div>
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
            <div className="submit-container">
                <button type="submit" className="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login!"}
                </button>
            </div>
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
            </div>
        </form>
        </div>
    );
};
