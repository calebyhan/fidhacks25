
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import logo from './assets/logo.png';
import "./Navbar.css"
function Navbar(){
    return(
        <nav className="nav">
            <Link to="/" className="home-p">
                <img className="image" src={logo} alt="logo"/>
            </Link>
            <ul>
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/profile">Profile</CustomLink>
                <CustomLink to="/view-spaces">Spaces</CustomLink>
                <CustomLink to="/post">Post</CustomLink>
                <CustomLink to="/resources">Resources</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end:true})
    
    return(
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

export default Navbar;