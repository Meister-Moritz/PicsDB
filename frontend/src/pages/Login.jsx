import { useState } from "react";
import ControlPannel from "./components/ControlPannel";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

export default function Login() {

  const [status, setStatus] = useState("");
  const [credentials, setCredentials] = useState({username: "", password: ""});
  return (
    <>
    <div className="content content-grid">
      <h1>Login</h1>

      <input 
        type="username" 
        name="username" 
        value={credentials.username}
        onChange={(e) => setCredentials((prev) => ({...prev, [e.target.name]: e.target.value}))} 
        placeholder="username"/>

      <input 
      type="password" 
      name="password" 
        value={credentials.password}
        onChange={(e) => setCredentials((prev) => ({...prev, [e.target.name]: e.target.value}))} 
      placeholder="password"/>

      <button onClick={()=>handleLogin(credentials, setCredentials, setStatus)}>Login</button>
      {status}
    </div>

    </>
);
}

function handleLogin(credentials, setCredentials, setStatus){
    setStatus("test")
}