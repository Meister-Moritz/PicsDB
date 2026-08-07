import {uploadPictures, getMandatoryCats } from "../../static/functions/TalkToBackend";
import { useState, useEffect } from "react";
import TagInput from "./TagInput";

export default function Upload(){
    const [status, setStatus] = useState([])
    const [tagInputs, setTagInputs] = useState([{catID: -1, catName: "empty", mandatoryTags: 0, tags: ""}])
    const [fileInput, setSileInput] = useState([]);  
    // const [mandatoryCats, setMandatoryCats] = useState([[0,"empty",0]]); 


    
    useEffect(() => {
        async function loadMandatoryCats() {
                const data = await getMandatoryCats(); // [[catID, catName, mandatoryTags],... ]
                const initialTags = [];
                for(const d of data){
                    const tmp = {catID: d[0], catName: d[1], mandatoryTags: d[2], tags: ""}
                    initialTags.push(tmp)
                }

                initialTags.push({catID: -1, catName: "other", mandatoryTags: 0, tags: ""})

                setTagInputs(initialTags)
            }
            loadMandatoryCats();
        }, []);
    
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
      {tagInputs.map((tagInput) => (
        <TagInput
            key={tagInput.catID}
            tagInput={tagInput.tags}
            setTagInputs={setTagInputs}
            catID={tagInput.catID}
            catName={tagInput.catName}
            mandatoryTags={tagInput.mandatoryTags}
        />
      ))}
    
   <button onClick={() => uploadPictures(fileInput, tagInputs, setStatus)}>Upload</button>
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


