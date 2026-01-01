import {uploadPictures} from "../../static/functions/TalkToBackend";
import { useState } from "react";
import TagInput from "./TagInput";

export default function Upload(){
    const [status, setStatus] = useState([])
    const [tagInput, setTagInput] = useState("")
    const [fileInput, setSileInput] = useState([]);  
    
    return(
<>
<details className="details">
    <summary>Upload</summary>
    <input 
        id="file_input" 
        type="file" 
        multiple
        onChange={(e) => setSileInput(Array.from(e.target.files))} 
        placeholder="Uplad files"
    />
    <TagInput tagInput={tagInput} setTagInput={setTagInput}></TagInput>
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