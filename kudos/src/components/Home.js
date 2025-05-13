import React from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; // 👈 import useCookies

export default function Home() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']); // 👈 use react-cookie
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie('user', { path: '/' }); // 👈 cleanly remove cookie
        navigate("/");
    };

    const isLoggedIn = !!cookies.user; // 👈 check if user cookie exists

    return (
        <div className="Home">
            <header className="Home title">Kudos</header>
            <div className="Home slogan">slogan here</div>
            <div className="elements">
                <div className="submit-container">
                    {!isLoggedIn ? (
                        <>
                            <div className="submit">
                                <Link to="/login">Login!</Link>
                            </div>
                            <div className="submit">
                                <Link to="/signup">Sign Up!</Link>
                            </div>
                        </>
                    ) : (
                        <div className="submit">
                            <Link to="/" onClick={ handleLogout }>Log Out</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
