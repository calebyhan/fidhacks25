import React from "react"
import "./Home.css"
import { Link } from "react-router-dom"


export default function Home() {
    return (
        <div className="Home">
            <header className="Home title">Kudos</header>
            <div className="Home slogan">slogan here</div>
            <div className="elements">
                <div className="submit-container">
                <div className="submit">
                    <Link to="/login">
                        Login!
                    </Link>
                </div>
            <   div className="submit">
                    <Link to="/signup">
                        Sign Up!
                    </Link>
                </div>
              </div>
            </div>
        </div>
    )
}