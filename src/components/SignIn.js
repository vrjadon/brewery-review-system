import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import '../Styles/SignIn.css';
import { Link, useNavigate } from "react-router-dom";
import AuthDetails from "./Authdetails";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/search');
      })
      .catch((error) => {
        console.log(error);
        alert("Email not found")
      });
  };
  
  return (
    <div className="sign-in-container">
      <form className="login-form" onSubmit={signIn}>
        <h1>Log In to your Account</h1>
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
        <button className="submit-button"  type="submit">Log In</button>
        <p className="create-account-link">Don't have an account?  <Link to="/signup">Create Your Account</Link> </p>
        
      </form>
    </div>
  );
};

export default SignIn;