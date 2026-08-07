export const API_URL = `${window.location.protocol}//${window.location.hostname}:5000`


// requests for img and tags to be uploaded
export async function uploadPictures(images, tagInputs, setStatus){

    let formData = new FormData();
    let tags = ""
    tagInputs.map((tagInput) => (tags = tags + "," + tagInput.tags))
    formData.append("tags", tags);
    for(let i = 0; i < images.length; i++){
        formData.append("files", images[i]);
    }

    const body = formData
    const response = await postCallProtected("/upload", body)
    setStatus([await response.json()])
}


// requests all mandatory TagCats
export async function getMandatoryCats(){
    const response = await getCallProtected("/getMandatoryCats")
    return response.json()
}


export async function getAccToken(username, password) {
    const body = JSON.stringify({ username, password })
    const response = await postCallProtected("/api/login", body)
    const data = await response.json();
    if (response.ok) {
        // Save the token locally
        localStorage.setItem("token", data.access_token);
       
        return ""
    } else {
        return data.error
    }
}

export async function registerUser(username, password) {
    const body = JSON.stringify({ username, password })
    const response = await postCallProtected("/api/register", body)
    const data = await response.json();

    if (response.ok) {
        return ""
    } else {
        return data.error
    }
}

// requests list of TagCategorys
export async function searchTagCategoryName(inputTagCat){
    const body = JSON.stringify({tags: inputTagCat})
    const response = await postCallProtected("/suggestTagCategorys", body)
    return await response.json();
}

// requests list of Tags
export async function searchTagName(inputTag, catID){
    const body = JSON.stringify({tags: inputTag, catID: catID})
    const response = await postCallProtected("/suggestTags", body)
    return await response.json();
}

// sends search Tags as list
export async function sendSearch(search){
    const body = JSON.stringify({search: search})
    const response = await postCallProtected("/api/search", body)
    return await response.json();
}

// it requests the page number where the img is, given the search tags
export async function navigateID(search, imgID, mode){
    const body = JSON.stringify({search:search, image_id: imgID, mode: mode})
    const response = await postCallProtected("/api/navigate_id", body)
    return await response.json();
}

// request for a tag and its synonyms to be added
export async function addTagBackend(tagInput, synonymInput, tagCatInput) {
    const body = JSON.stringify({newTag: tagInput, synonyms:synonymInput, tagCatName:tagCatInput})
    const response = await postCallProtected("/addTag", body)
    return await response.json();   
}

// request for a tagcat to be added
export async function addTagCatBackend(tagCatInput, mandatoryInput) {
    const body = JSON.stringify({newTagCat: tagCatInput, mandatoryInput:mandatoryInput})
    const response = await postCallProtected("/addTagCat", body)
    return await response.json();      
}

// requests images: tages, upload time, ...
export async function fetchImageDetail(id) {
    const body = JSON.stringify({id:id})
    const response = await postCallProtected("/api/imgageDetail", body)
    return response.json(); 
}

// requests image
export async function serveImage(imgID, OGimg, suffix) {
    const body = JSON.stringify({imgID:imgID, OGimg:OGimg, suffix:suffix})
    return await postCallProtected("/serveImage", body)
}

// 
export async function updateFavs(newFavState) {
    // newFavState is [id, isFav]
    const body = JSON.stringify({newFavsState: [newFavState]})
    const response = await postCallProtected("/updateFavs", body)
    return await response.json();     
}

// requests an image to be deleted
export async function deleteImg(id) {
    const body = JSON.stringify({id:id})
    const response = await postCallProtected("/api/deleteImg", body)
    return await response.json();   
}

export async function postCallProtected(route, body){
    const token = localStorage.getItem("token");
    const headers = {"Authorization": `Bearer ${token}`};

    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}${route}`, {
        method: "POST", // or POST, PUT, DELETE, etc.
        headers: headers,
        body: body
    });

    return await response
}

export async function getCallProtected(route){
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}${route}`, {
    method: "GET", // or POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // Notice the format: "Bearer " followed by your token string
      "Authorization": `Bearer ${token}` 
    }
  });

  return await response
}