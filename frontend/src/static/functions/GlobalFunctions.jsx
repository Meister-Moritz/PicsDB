import { useState } from "react";
import {searchTagName, addTagBackend, navigateID} from "./TalkToBackend";
import { jwtDecode } from "jwt-decode";

export function handleAppendSuggestionsSearch(tag, searchInput, setSearchInput, textareaRef){
    
    let input_list = searchInput.split(/[,;\s]+/)
    input_list[input_list.length-1] = tag
    const newSearchInput = input_list.join("\n") + "\n"
    setSearchInput(newSearchInput)
}

export function handleAppendSuggestion(tag, catID, input, setTagInputs, textareaRef){
    let input_list = input.split(/[,;\s]+/)
    input_list[input_list.length-1] = tag
    setTagInputs(prev => prev.map(item => item.catID === catID ? { ...item, tags: input_list.join('\n')+'\n' } : item))
    textareaRef.current.focus();
}

export async function handleTagSuggestionsCat(input, catID, setSuggestions){
    let input_list = input.split(/[,;\s]+/)
    input = input_list[input_list.length-1]
    if (input.length < 2) {
        setSuggestions([])
        return;
    }

    const tags = await searchTagName(input, catID)

    if (tags[0] == input){//don't show suggestion if tag is already filled
        setSuggestions([])
        return
    }

    setSuggestions(tags)
};



export function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);

        // Check if the token has expired
        const currentTime = Date.now() / 1000; // in seconds
        if (decoded.exp < currentTime) {
            localStorage.removeItem("token"); // Clean up expired token
            return null;
    }
    return decoded; // Contains identity, exp, sub, etc.
    } catch (error) {
        localStorage.removeItem("token");
        return null;
    }
}


export async function handleTagSuggestions(input, setSuggestions){
    const catID = -1;
    let input_list = input.split(/[,;\s]+/)
    input = input_list[input_list.length-1]
    if (input.length < 2) {
        setSuggestions([])
        return;
    }

    const tags = await searchTagName(input, catID)

    if (tags[0] == input){//don't show suggestion if tag is already filled
        setSuggestions([])
        return
    }

    setSuggestions(tags)
};

export async function handleTagCatSuggestions(input, setSuggestions){
    let input_list = input.split(/[,;\s]+/)
    input = input_list[input_list.length-1]
    if (input.length < 2) {
        setSuggestions([])
        return;
    }

    const tags = await searchTagCatName(input)

    if (tags[0] == input){//don't show suggestion if tag is already filled
        setSuggestions([])
        return
    }

    setSuggestions(tags)
};

export function handleAdjustSize(textareaRef){
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
}

export async function addTag(tagInput, synonymInput, tagCatInput, status, setStatus){
    let myError = ''
    const minTags = 1
    const maxTags = 1
    const minSynonyms = 1 
    const maxSynonyms = -1
    let tmp = validateTagInput(tagInput, minTags, maxTags)
    tagInput = tmp.input
    myError = myError + tmp.inputError
    tmp = validateTagInput(synonymInput, minSynonyms, maxSynonyms)
    synonymInput = tmp.input
    myError = myError + tmp.inputError

    if (myError != '') {
        setStatus(status+myError)
        return
    }

    myError = await addTagBackend(tagInput, synonymInput, tagCatInput)
    setStatus(myError)
    return

};

export function validateTagInput(raw, minTags, maxTags){

    const pattern = /^[a-z0-9_,]+$/;
    let inputError = '';    
    let cleaned = '';

    raw = raw.replace(/\s+/g, ',');  //interprete spaces, newlines as komma
    raw = raw.replace(/,,+/g, ',');  //remove double comma
    raw = raw.toLowerCase();        // convert to lower case
    let tag_list = raw.split(',');
    tag_list = [...new Set(tag_list)];
    cleaned = tag_list.join(',');
    

    if (cleaned=="" && minTags == 0){
        inputError = '';
    }
    else if (!pattern.test(cleaned)) {
        inputError = 'Invalid tag or synonym format.\n';
    } 
    else if (tag_list.length < minTags) {
        inputError = `Give at least ${minTags} synonyms\n`;
    }
    else if (maxTags > 0 && tag_list.length > maxTags) {
        inputError = `Give at most ${maxTags} synonyms\n`;
    }
    else
    {
        inputError = '';
    }

    return {inputError: inputError, input: cleaned}
}

export async function navigateImages(search, currentID, mode, webpage, navigate){

    console.log(search)
    const image = await navigateID(search, currentID, mode)
    let newPage = webpage + currentID
    if(image.length > 0){
        
        newPage = webpage + image[0][0]
    }
    
    navigate(newPage)
}


