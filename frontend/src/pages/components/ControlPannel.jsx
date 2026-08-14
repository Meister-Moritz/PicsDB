import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {handleAppendSuggestion, handleTagSuggestions, navigateImages, handleAdjustSize, getCurrentUser, handleAppendSuggestionsSearch} from "../../static/functions/GlobalFunctions";
import { fetchImageDetail, updateFavs, deleteImg } from "../../static/functions/TalkToBackend"
import { Confirm } from "./PopUp"
import { useSearch } from "../../App";
import { Login } from "./Login";
import { Register } from "./Register";

export default function ControlPannel({title, details = {}}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {search, setSearch } = useSearch();
    let pannel = <></>;
    const [popUp, setPopUp] =  useState (<></>);
    const [userDiv, setUserDiv] = useState(<></>)
   
    if ( location.pathname.toLowerCase().includes("gallery") ){
        pannel = <GalleryPannel search={search} setSearch={setSearch}/>
    }
    else if (location.pathname.toLowerCase().includes("imageviewer")) {
        pannel = <ViewerPannel search={search} setSearch={setSearch} navigate={navigate} details={details} setPopUp={setPopUp}/>
    }
    
    useEffect(() => {
        const user = getCurrentUser()

        if(getCurrentUser() != null){
            const username = user["username"]
            setUserDiv(
                <div className="userInfo">
                    <button onClick={() => setPopUp(<Register setPopUp={setPopUp}></Register>)}>Register</button>
                    <h1>{username}</h1>
                </div>
        )
        }
        else{
            setPopUp(<Login setPopUp={setPopUp}></Login>)
            setUserDiv(
                <div className="userInfo">
                    <button onClick={() => setPopUp(<Login setPopUp={setPopUp}></Login>)}>Login</button>
                </div>
            )
        }
    },[])

  return (
    <>
    <div className="ControlPannel">
    <h1>{title}</h1>
    {pannel}
    <button onClick={() => navigate("/settings", { replace: true })}>Settings</button>
    <button onClick={()=>navigate(`/Gallery/page/${search.page}`, { replace: true })}>Gallery</button>
    {userDiv}    
    </div>
    {popUp}
    </>               
);
}

function SearchPannel({search, setSearch}){
    const [searchInput, setSearchInput] = useState("");
    const [loginPopUp, setLoginPopUp] = useState(true)
    const [suggestions, setSuggestions] = useState([]);
    const textareaRef = useRef(null);

    useEffect(() => {if(search.searchTags != ""){setSearchInput(search.searchTags)}}, [])
    useEffect(() => {handleTagSuggestions(searchInput, setSuggestions)}, [searchInput]);
    useEffect(() => handleAdjustSize(textareaRef), [searchInput])
    return(
        <>
        <textarea
            name="searchInput"  
            ref={textareaRef}
            // onInput={handleInput}
            onChange={(e) => setSearchInput(e.target.value)} 
            value={searchInput}
            rows={1}
            style={{
            resize: "none",
            overflow: "hidden",
            }}
            placeholder="tag_1, tag_2,..."
        />
        {/* <input 
            type="text" 
            name="searchInput" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} 
            placeholder="tag_1, tag_2,..."/> */}
        <ul>
        {suggestions.map(tag => <li key={tag}> 
                                <button 
                                    className="suggestion_tag"  
                                    onClick={() => handleAppendSuggestionsSearch(tag, searchInput, setSearchInput, textareaRef)}
                                >{tag}
                                </button>
                                </li>)}
        </ul>
        <button onClick={() => setSearch(prev => ({ ...prev, searchTags: searchInput + "\n"}))}>search</button>
        </>
    )
}

function GalleryPannel({search, setSearch}){

return (
<>
<SearchPannel search={search} setSearch={setSearch}/>
    <label>
        <input type="checkbox" 
            checked={search.favMode}
            onChange={(e) => setSearch(prev => ({ ...prev, favMode: e.target.checked }))}
        />
        Favs Only
    </label>
</>
)

}

function ViewerPannel({search, setSearch, navigate, details, setPopUp}){
    const {showDetails, setShowDetails} = details
    const { id } = useParams();
    const [imgDetail, setImgDetail] = useState({idFav:false, tagList: []});

    useEffect(() => {
      asyncImageDetail(id, setImgDetail)
    }, [id]);

    let favButton = <></>;  
    if (imgDetail.isFav)  {
    favButton = <button onClick={()=>handleFavButton(id, imgDetail, setImgDetail)}>remove Fav</button>;
    }
    else{
    favButton = <button onClick={()=>handleFavButton(id, imgDetail, setImgDetail)}>add Fav</button>;
    }
return (
<>
    <button onClick={()=>{setShowDetails(!showDetails)}}>show/hide</button>
    {favButton}
    <div>
        <button onClick={()=>navigateImages(search, id, 'next', '/ImageViewer/id/', navigate)}>prev</button>
        <button onClick={()=>navigateImages(search, id, 'prev', '/ImageViewer/id/', navigate)}>next</button>
    </div>
    <button onClick={()=>{handleDelete(setPopUp, deleteImg, id)}}>delete</button>
    <ul>
        {imgDetail.tagList.map(tag => <li className="tag_list" key={tag}>{tag}</li>)}
    </ul>
    <button onClick={()=>navigate(`/Gallery/page/${search.page}`, { replace: true })}>Gallery</button>
</>
)
}

async function asyncImageDetail(id, setImgDetail){
  const tmpImgDetail =  await fetchImageDetail(id)
  setImgDetail(tmpImgDetail);
}

function handleFavButton(imgID, imgDetail, setImgDetail){
  updateFavs([imgID, !imgDetail.isFav])
  setImgDetail(prev => ({ ...prev, isFav: !imgDetail.isFav }))
}

function handleDelete(setPopUp, deleteImg, id){
    setPopUp(<Confirm text={"Are you sure you want to delete this picture"} setPopUp={setPopUp} deleteImg={deleteImg} param={id}></Confirm>)
}