import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup";
import Home from "./components/Home";
import Login from "./components/Login"
import PostInterface from "./components/PostInterface";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<PostInterface />} />

        </Routes>
      </Router>
  );
}

export default App;
