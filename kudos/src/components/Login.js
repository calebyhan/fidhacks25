import React, { useRef, useState } from 'react';
import './Signup.css'

import user_icon from './assets/person.png'
import email_icon from './assets/email.png'
import password_icon from './assets/password.png'



export default function Login () {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()

    try {
        setError("")
        setLoading(true)
        setError("")
    }catch (err){
        setError(`Failed to create an account: ${err.message}`)
    }
    setLoading(false)
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
            <input type="email" ref={emailRef} placeholder="Email address" name="" id="email" />
        </div>
        <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" ref={passwordRef} placeholder="Password" name="" id="password" />
        </div>

    
        
        <div className="submit-container">
            <button disabled={loading} className= "submit">Login!</button>
        </div>

        </div>
        </form>
        
        
    </div>
  );
};


