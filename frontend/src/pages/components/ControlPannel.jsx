import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {handleAppendSuggestion, handleSuggestions, navigateImages} from "../../static/functions/GlobalFunctions";
import { fetchImageDetail, updateFavs } from "../../static/functions/TalkToBackend"
import { useSearch } from "../../App";

export default function ControlPannel({title, details = {}}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {search, setSearch } = useSearch();
    let  standartPannel = <StandartPannel search={search} setSearch={setSearch}/>
    let pannel = <></>;

    if ( location.pathname.toLowerCase().includes("gallery") ){
        pannel = <GalleryPannel search={search} setSearch={setSearch}/>
    }
    else if (location.pathname.toLowerCase().includes("imageviewer")) {
        pannel = <ViewerPannel search={search} setSearch={setSearch} navigate={navigate} details={details}/>
    }

  return (
    <div className="ControlPannel">
    <h1>{title}</h1>
    {standartPannel}
    {pannel}
    <button onClick={()=>navigate(`/Gallery/page/${search.page}`, { replace: true })}>Gallery</button>
    <button onClick={()=>navigate("/settings", { replace: true })}>Settings</button>
    </div>
);
}

function StandartPannel({search, setSearch}){
    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {handleSuggestions(searchInput, setSuggestions)}, [searchInput]);
    return(
        <>
        <input 
            type="text" 
            name="searchInput" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} 
            placeholder="tag_1, tag_2,..."/>
        <ul>
        {suggestions.map(tag => <li className="suggestion_tag" key={tag} onClick={() => handleAppendSuggestion(tag, searchInput, setSearchInput)}>{tag}</li>)}
        </ul>
        <button onClick={() => setSearch(prev => ({ ...prev, searchTags: searchInput}))}>search</button>
        </>
    )
}

function GalleryPannel({search, setSearch}){

return (
<>
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

function ViewerPannel({search, setSearch, navigate, details}){
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
    <button onClick={()=>navigateImages(search, id, 'next', '/ImageViewer/id/', navigate)}>next</button>
    <button onClick={()=>navigateImages(search, id, 'prev', '/ImageViewer/id/', navigate)}>prev</button>
    
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