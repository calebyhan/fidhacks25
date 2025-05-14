import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Navbar from "./components/Navbar"; 
import Signup from "./components/Signup";
import Home from "./components/Home";
import Login from "./components/Login"
import PostInterface from "./components/PostInterface";
import Space from "./components/Space";
import CreateSpace from "./components/CreateSpace";
import JoinSpace from './components/JoinSpace';
import ViewSpaces from './components/ViewSpaces';
import Profile from "./components/Profile"

function App() {
    return (
        <Router>
        <Navbar />
        <Routes>
        
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post" element={<PostInterface />} />
            <Route path="/space/:spaceId" element={<Space />} />
            <Route path="/create-space" element={<CreateSpace />} />
            <Route path="/join-space" element={<JoinSpace />} />
            <Route path="/view-spaces" element={<ViewSpaces />} />
            <Route path="/profile" element={<Profile />} />

            </Routes>
        </Router>
    );
}

export default App;
