export const API_URL = `${window.location.protocol}//${window.location.hostname}:5000`



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
 
export async function sendSearch(search){
    const res = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({search: search})
    });
    const data = await res.json();
    return data
}

export async function navigateID(search, imgID, mode){
    const res = await fetch(`${API_URL}/api/navigate_id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({search:search, image_id: imgID, mode: mode})
    });
    const data = await res.json();
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

export async function fetchImageDetail(id) {
    const res = await fetch(`${API_URL}/api/imgageDetail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id:id})
    });
    const data = await res.json();
    return data
}

export async function updateFavs(newFavState) {
    // newFavState is [id, isFav]
    const res = await fetch(`${API_URL}/updateFavs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                newFavsState: [newFavState]
        })
    });
    const status = await res.json();
    return status;
    
}