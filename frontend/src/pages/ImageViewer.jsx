import { useNavigate, useParams } from 'react-router-dom';
import { API_URL, fetchImageDetail, updateFavs } from "../static/functions/TalkToBackend"
import { useSearch } from "../App";
import { navigateImages } from "../static/functions/GlobalFunctions";
import { useState, useEffect } from 'react';

export default function ImageViewer() {
  const { id } = useParams();
  const { search, setSearch } = useSearch();
  const [imgDetail, setImgDetail] = useState({idFav:false, tagList: []});
  const navigate = useNavigate();

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
    <div className="content content-grid">
      <img className="imgPreview" key={id} src={`${API_URL}/serveImage?imgID=${id}&OGimg=${true}&suffix=null`} alt="Sample"/>
      <button onClick={()=>navigate(`/Gallery/page/${search.page}`)}>Gallery</button>
      <button onClick={()=>navigateImages(search, id, 'next', '/ImageViewer/id/', navigate)}>next</button>
      <button onClick={()=>navigateImages(search, id, 'prev', '/ImageViewer/id/', navigate)}>prev</button>
      {favButton}
    </div>
    </>
);
}

async function asyncImageDetail(id, setImgDetail){
  const tmpImgDetail =  await fetchImageDetail(id)
  setImgDetail(tmpImgDetail);
}

function handleFavButton(imgID, imgDetail, setImgDetail){
  updateFavs([imgID, !imgDetail.isFav])
  setImgDetail(prev => ({ ...prev, isFav: !imgDetail.isFav }))
}