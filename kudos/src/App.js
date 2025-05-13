import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from 'react-cookie'

import Signup from "./components/Signup";
import Home from "./components/Home";
import Login from "./components/Login"
import PostInterface from "./components/PostInterface";


function App() {
  const [cookies, setCookie] = useCookies(['user'])

  function handleLogin(user) {
    setCookie('user', user, { path: '/' })
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
  
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
          <Route path="/post" element={<PostInterface />} />

        </Routes>
      </Router>
  );
}

export default App;
