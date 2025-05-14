import React from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Home() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie('user', { path: '/' });
        navigate("/");
    };

    const isLoggedIn = !!cookies.user;

    return (
        <div className="Home">
            {!isLoggedIn ? (
                <>
                    <div className="logo">
                        <img src={require('./assets/logo.png')} alt="logo" />
                    </div>
                    <div className="elements">
                        <div className="submit-container">
                            <div className="submit">
                                <Link to="/login">LOGIN</Link>
                            </div>
                            <div className="submit">
                                <Link to="/signup">SIGN UP</Link>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="welcome">
                    <h2>Welcome back!</h2>
                    <div className="submit">
                            <Link to="/" onClick={ handleLogout }>Log Out</Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}