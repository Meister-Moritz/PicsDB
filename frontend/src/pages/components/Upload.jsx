import {handleAppendSuggestion, handleSuggestions, handleAdjustSize } from "../../static/functions/GlobalFunctions";
import {uploadPictures} from "../../static/functions/TalkToBackend";
import { useEffect, useState, useRef } from "react";

export default function Upload(){
    const [status, setStatus] = useState([])
    const [tagInput, setTagInput] = useState("")
    const [suggestions, setSuggestions] = useState([]);
    const [fileInput, setSileInput] = useState([]);
    const textareaRef = useRef(null);

    useEffect(() => {handleSuggestions(tagInput, setSuggestions)}, [tagInput]);  
    useEffect(() => handleAdjustSize(textareaRef), [tagInput])

    return(
<>
<details>
    <summary>Upload</summary>
    <input 
        id="file_input" 
        type="file" 
        multiple
        onChange={(e) => setSileInput(Array.from(e.target.files))} 
        placeholder="Uplad files"
    />
    <textarea
        id="tag_input" 
        ref={textareaRef}
        // onInput={handleInput}
        onChange={(e) => setTagInput(e.target.value)} 
        value={tagInput}
        rows={1}
        style={{
        resize: "none",
        overflow: "hidden",
        }}
        placeholder="tag_1, tag_2,..."
    />
        <ul id="tag_suggestion">
        {suggestions.map(tag => <li 
            className="tag_suggestion" 
            key={tag} 
            onClick={() => handleAppendSuggestion(tag, tagInput, setTagInput, textareaRef)}
        >{tag}</li>)}
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