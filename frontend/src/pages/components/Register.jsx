import { useEffect, useState } from "react"
import { Login } from "./Login";
import { registerUser } from "../../static/functions/TalkToBackend"


export function Register({setPopUp}){
    const [username, setUsername] = useState("")
    const [pwd, setPwd] = useState("")
    const [status, setStatus] = useState("")

    let outputStatus = <div className="empty">{status}</div>
    useEffect(() => {
        if(status != ""){
            outputStatus = <div className="status">{status}</div>
        }
    },[status])

return (
    <div className="popup_wrapper">
        <div className="popup">
            <h1 className="popup_headline">Register</h1>
            <div className="popup_body">
                <input 
                    id="username" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username"
                />
                <input 
                    id="password" 
                    type="password" 
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)} 
                    placeholder="Password" 
                />
            </div>
            <div className="popup_footline">
                <button onClick={() => setPopUp(<></>)}>Cancel</button>
                <button onClick={() => handleRegister(username, pwd, setPopUp, setStatus)}>Register</button>
            </div>    
            {outputStatus}
        </div>
    </div>
    );
}

async function handleRegister(username, pwd, setPopUp, setStatus){
    const error = await registerUser(username, pwd)
    if(error == ""){
        setPopUp(setPopUp(<Login setPopUp={setPopUp} statusMessage="User registered, you can login now"></Login>))
        return
    }
    setStatus(error)
    
}