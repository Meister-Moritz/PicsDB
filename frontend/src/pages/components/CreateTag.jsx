import {handleAppendSuggestion, handleTagSuggestions, addTag} from "../../static/functions/GlobalFunctions";
import { useEffect, useState } from "react";

export default function CreateTag(){
    const [status, setStatus] = useState("")
    const [tagInput, setTagInput] = useState("")
    const [tagCatInput, setTagCatInput] = useState("")
    const [synonymInput, setSynonymInput] = useState("")
    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {handleTagSuggestions(synonymInput, setSuggestions)}, [synonymInput]);

    return(
<>
<details>
    <summary>CreateTag</summary>
    <input 
        id="tag_category_input_str" 
        type="text" 
        value={tagCatInput}
        onChange={(e) => setTagCatInput(e.target.value)} 
        placeholder="tag category"
        list="tag_category_suggestion"
    />
    <ul id="tag_category_suggestion">
        {suggestions.map(tag => <li className="suggestion_synonym" key={tag} onClick={() => handleAppendSuggestion(tag, tagInput, setTagInput)}>{tag}</li>)}
    </ul>
    <input 
        id="tag_input" 
        type="text" 
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)} 
        placeholder="new_tag"
        list="tag_suggestion"
    />
    <input 
        id="synonym_input" 
        type="text" 
        value={synonymInput}
        onChange={(e) => setSynonymInput(e.target.value)} 
        placeholder="synonym_1, synonym_2,..."
        list="synonym_suggestion"
    />
    <ul id="synonym_suggestion">
        {suggestions.map(tag => <li className="suggestion_synonym" key={tag} onClick={() => handleAppendSuggestion(tag, tagInput, setTagInput)}>{tag}</li>)}
    </ul>
    <button onClick={() => addTag(tagInput, synonymInput, tagCatInput, status, setStatus)}>Create Tag</button>
</details>
<div>
    {status}
</div>
</>
    )
}
