import {handleAppendSuggestion, handleTagSuggestions} from "../../static/functions/GlobalFunctions";
import {addTagCatBackend} from "../../static/functions/TalkToBackend";
import { useEffect, useState } from "react";

export default function CreateTagCat() {
  
    const [status, setStatus] = useState("")
    const [tagCatInput, setTagCatInput] = useState("")
    const [mandatoryInput, setMandatoryInput] = useState("")

    return(
<>
<details>
    <summary>Create tag category</summary>
    <input 
        id="tag_input_str" 
        type="text" 
        value={tagCatInput}
        onChange={(e) => setTagCatInput(e.target.value)} 
        placeholder="new tag category"
    />
    <input 
        id="mandatory_input_int" 
        type="text" 
        value={mandatoryInput}
        onChange={(e) => setMandatoryInput(e.target.value)} 
        placeholder="1"
    />
    <button onClick={() => addTagCat(tagCatInput, mandatoryInput, status, setStatus)}>Create tag category</button>
</details>
<div>
    {status}
</div>

</>
    )
}

async function addTagCat(tagCatInput, mandatoryInput, status, setStatus){
    let myError = ''
    myError = await addTagCatBackend(tagCatInput, mandatoryInput)
    
    setStatus(myError)
    return

};