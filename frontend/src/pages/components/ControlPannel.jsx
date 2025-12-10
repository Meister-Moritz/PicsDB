import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {handleAppendSuggestion, handleSuggestions} from "../../static/functions/GlobalFunctions";

export default function ControlPannel({title}) {
    const location = useLocation();
    const navigate = useNavigate();
    let pannel = <GalleryPannel />;

    if ( location.pathname.toLowerCase().includes("gallery") ){
        pannel = <GalleryPannel />
    }
    else if (location.pathname.toLowerCase().includes("imageeditor")) {
        pannel = <EditorPannel />
    }

  return (
    <div className="ControlPannel">
    <h1>{title}</h1>
    {pannel}
    <button onClick={()=>navigate("/gallery/page/1", { replace: true })}>Gallery</button>
    <button onClick={()=>navigate("/settings", { replace: true })}>Settings</button>
    </div>
);
}

function GalleryPannel(){
    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {handleSuggestions(searchInput, setSuggestions)}, [searchInput]);
return (
<>
    <input 
    type="text" 
    name="searchInput" 
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)} 
    placeholder="tag_1, tag_2,..."/>
    <ul>
    {suggestions.map(tag => <li className="suggestion_tag" key={tag} onClick={() => handleAppendSuggestion(tag, searchInput, setSearchInput)}>{tag}</li>)}
    </ul>
</>
)

}

function EditorPannel(){
return (<h2>EditorPannel</h2>)
}