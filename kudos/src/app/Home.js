import Link from "next/link";
import "./home.css"

export default function Home() {
    return (
      <div className="Home">
        <header className="Home title">Kudos</header>
        <div className="Home slogan">slogan here</div>
        <div className="elements">
            <div className ="submit-container">
                <div className="submit">Login!</div>
                <div className="submit">
                    <Link href="/signup">
                    Sign Up!
                    </Link>
                </div>
            </div>
        </div>
      </div>
    );
}

