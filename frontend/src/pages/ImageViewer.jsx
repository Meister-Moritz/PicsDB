import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from "../static/functions/TalkToBackend"
import { useSearch } from "../App";
import { navigateImages } from "../static/functions/GlobalFunctions";

export default function ImageViewer() {
  const { id } = useParams();
  const { search, setSearch } = useSearch();
  const navigate = useNavigate();
  
  return (
    <>
    <div className="content content-grid">
      <img className="imgPreview" key={id} src={`${API_URL}/serveImage?imgID=${id}&OGimg=${true}&suffix=null`} alt="Sample"/>
      <button onClick={()=>navigate(`/Gallery/page/${search.page }`)}>Gallery</button>
      <button onClick={()=>navigateImages(search, id, 'next', '/ImageViewer/id/', navigate)}>next</button>
      <button onClick={()=>navigateImages(search, id, 'prev', '/ImageViewer/id/', navigate)}>prev</button>
    </div>

    </>
);
}