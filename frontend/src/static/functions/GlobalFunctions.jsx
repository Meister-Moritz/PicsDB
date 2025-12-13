import {searchTagName, addTagBackend, navigateID} from "./TalkToBackend";

export function handleAppendSuggestion(tag, input, setInput){
    let input_list = input.split(/[,;\s/g]+/)
    input_list[input_list.length-1] = tag
    console.log(input_list.join(','))
    setInput(input_list.join(','))
}


export async function handleSuggestions(input, setSuggestions){
    let input_list = input.split(/[,;\s/g]+/)
    input = input_list[input_list.length-1]
    if (input.length < 2) {
        setSuggestions([])
        return;
    }

    const tags = await searchTagName(input)

    console.log(tags)
    if (tags[0] == input){//don't show suggestion if tag is already filled
        setSuggestions([])
        return
    }

    setSuggestions(tags)
};

export async function addTag(tagInput, synonymInput, status, setStatus){
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

    myError = await addTagBackend(tagInput, synonymInput)
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

    const image = await navigateID(search.searchTags, currentID, mode)
    let newPage = webpage + currentID
    if(image.length > 0){
        
        newPage = webpage + image[0][0]
    }
    
    navigate(newPage)
}