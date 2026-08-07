import {handleAppendSuggestion, handleTagSuggestionsCat, handleAdjustSize } from "../../static/functions/GlobalFunctions";
import { useEffect, useState, useRef } from "react";

export default function TagInput({tagInput, setTagInputs, catID, catName, mandatoryTags}){
    const [suggestions, setSuggestions] = useState([]);
    const textareaRef = useRef(null);

    useEffect(() => {handleTagSuggestionsCat(tagInput, catID, setSuggestions)}, [tagInput]);  
    useEffect(() => handleAdjustSize(textareaRef), [tagInput])

    return(
<div className="tag_input_cat">
    <h3>{catName} [{mandatoryTags}]</h3>
    <div className="tag_input_div">
        <textarea
            className="tag_input"
            id="tag_input" 
            ref={textareaRef}
            // onInput={handleInput}
            onChange={(e) => setTagInputs(prev => prev.map(item => item.catID === catID ? { ...item, tags: e.target.value } : item))} 
            value={tagInput}
            rows={1}
            style={{
            resize: "none",
            overflow: "hidden",
            }}
            placeholder={"tag_1, tag_2,..."}
        />
            <ul className = "suggestion_box" id="tag_suggestion">
            {suggestions.map(tag => <li key={tag}> 
                                    <button                             
                                        className="tag_suggestion" 
                                        onClick={() => handleAppendSuggestion(tag, catID, tagInput, setTagInputs, textareaRef)}
                                    >{tag}
                                    </button>
                                    </li>)}
            </ul>
    </div>
</div>
    )
}
