import {handleAppendSuggestion, handleTagSuggestions, handleAdjustSize } from "../../static/functions/GlobalFunctions";
import { useEffect, useState, useRef } from "react";

export default function TagInput({tagInput, setTagInput}){
    const [suggestions, setSuggestions] = useState([]);
    const textareaRef = useRef(null);

    useEffect(() => {handleTagSuggestions(tagInput, setSuggestions)}, [tagInput]);  
    useEffect(() => handleAdjustSize(textareaRef), [tagInput])

    return(
<div className="tag_input_div">
    <textarea
        className="tag_input"
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
        <ul className = "suggestion_box" id="tag_suggestion">
        {suggestions.map(tag => <li key={tag}> 
                                <button                             
                                    className="tag_suggestion" 
                                    onClick={() => handleAppendSuggestion(tag, tagInput, setTagInput, textareaRef)}
                                >{tag}
                                </button>
                                </li>)}
        </ul>
</div>
    )
}
