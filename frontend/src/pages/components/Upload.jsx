import {handleAppendSuggestion, handleSuggestions} from "../../static/functions/GlobalFunctions";
import {uploadPictures} from "../../static/functions/TalkToBackend";
import { useEffect, useState } from "react";

export default function Upload(){
    const [status, setStatus] = useState([])
    const [tagInput, setTagInput] = useState("")
    const [suggestions, setSuggestions] = useState([]);
    let fileInput = []
    useEffect(() => {handleSuggestions(tagInput, setSuggestions)}, [tagInput]);

    return(
<>
<details>
    <summary>Upload</summary>
    <input 
        id="file_input" 
        type="file" 
        multiple
        onChange={(e) => fileInput = Array.from(e.target.files)} 
        placeholder="Uplad files"
    />
    <input 
        id="tag_input" 
        type="text" 
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)} 
        placeholder="tag_1, tag_2,..."
        list="tag_suggestion"
    />
        <ul id="tag_suggestion">
        {suggestions.map(tag => <li className="tag_suggestion" key={tag} onClick={() => handleAppendSuggestion(tag, tagInput, setTagInput)}>{tag}</li>)}
        </ul>
   <button onClick={() => uploadPictures(fileInput, tagInput, setStatus)}>Upload</button>
</details>
<div>
    <ul>
      {status.map((item, index) => (
        <pre>{item}</pre>
      ))}
    </ul>
</div>
</>
    )
}
