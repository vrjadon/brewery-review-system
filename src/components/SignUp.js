import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import "../Styles/SignUp.css"
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate= useNavigate();
  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/search');
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong")
      });
  };

  return (
    <div className="sign-in-container">
      <form  className="signup-form" onSubmit={signUp}>
        <h1>Create Account</h1>
        <input
          className="input-field" 
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          className="input-field"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button className="submit-button" type="submit">Sign Up</button>
        <p className="login-link">Already have an account? <Link to="/">Log In</Link></p>
        
      </form>
    </div>
  );
};

export default SignUp;