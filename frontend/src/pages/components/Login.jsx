import { useEffect, useState } from "react"
import { getAccToken } from "../../static/functions/TalkToBackend"


export function Login({setPopUp, statusMessage = ""}){
    const [username, setUsername] = useState("")
    const [pwd, setPwd] = useState("")
    const [status, setStatus] = useState(statusMessage)

    let outputStatus = <div className="empty">{status}</div>
    useEffect(() => {
        if(status != ""){
            outputStatus = <div className="status">{status}</div>
        }
    },[status])

return (
    <div className="popup_wrapper">
        <div className="popup">
            <h1 className="popup_headline">Login</h1>
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
                <button onClick={() => handleLogin(username, pwd, setPopUp, setStatus)}>Login</button>
            </div>
            {outputStatus}
        </div>
    </div>
    );
}

async function handleLogin(username, pwd, setPopUp, setStatus){
    const error = await getAccToken(username, pwd)
    if(error == ""){
        setPopUp(<></>)
        window.location.reload();
        return
    }
    setStatus(error)
    
}