export const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/`



export async function uploadPictures(images, tagInput, setStatus){

    let formData = new FormData();
    
    formData.append("tagInput", tagInput);
    for(let i = 0; i < images.length; i++){
        formData.append("files", images[i]);
    }
    console.log(API_URL)
    console.log(tagInput)
    const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    })
    setStatus(await res.json())
}

export async function searchTagName(inputTag){
    const res = await fetch(`${API_URL}/suggestTags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({tags: inputTag})
    });
    const tags = await res.json();
    return tags;
}
 
export async function sendQuery(query){
    if (query.query == ''){
        return 'empty'
    }
    let status = ''
    const res = await fetch(`${API_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
    });
    const data = await res.json();
    console.log(data)
    return data
}


export async function addTagBackend(tagInput, synonymInput) {
    const res = await fetch(`${API_URL}/addTag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                newTag: tagInput,
                synonyms:synonymInput
        })
    });
    const status = await res.json();
    return status;
    
}