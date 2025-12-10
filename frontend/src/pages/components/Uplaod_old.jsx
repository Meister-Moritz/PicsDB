import { useState, useEffect } from "react";
import {uploadPictures} from "../../static/functions/TalkToBackend.jsx";
import { handleSuggestions, handleAppendSuggestion } from "../../static/functions/GlobalFunctions.jsx";
import "../../static/css/upload.css"

export default function ImageUploader() {
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState("")
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {handleSuggestions(tagInput, setSuggestions)}, [tagInput]); 

  return (
    <>
        <div className="settings-layout">
        <div className="setting">
        <details>
        <summary>Upload</summary>
            <input type="file" multiple onChange={(e) => handleChange(e, setImages)} />
            <input 
                    id="tag_input" 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)} 
                    placeholder="tag_1, tag_2,..."
                    list="tag_suggestion"
              />
              <ul id="tag_suggestion">
              {suggestions.map(tag => <li className="suggestion_tag" key={tag} onClick={() => handleAppendSuggestion(tag, tagInput, setTagInput)}>{tag}</li>)}
              </ul>
            <button onClick={() => uploadPictures(images, tagInput)}>Upload Images</button>
        </details>
        </div>
        </div>
    </>
  );
}

function handleChange(e, setImages){
    setImages(Array.from(e.target.files));
}
