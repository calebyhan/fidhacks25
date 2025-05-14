import React from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Home() {
    const [cookies, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie('user', { path: '/' });
        navigate("/");
    };

    return (
        <div className="Home">
            {!cookies.user ? (
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
                            <button onClick={handleLogout} className="submit">Log Out</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
