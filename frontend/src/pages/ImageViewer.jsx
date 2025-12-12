import { useParams } from 'react-router-dom';
import { API_URL } from "../static/functions/TalkToBackend"
export default function ImageViewer() {
  const { id } = useParams();
  
  return (
    <>
    <div className="content content-grid">
      <img className="imgPreview" key={id} src={`${API_URL}/serveImage?imgID=${id}&OGimg=${true}&suffix=null`} alt="Sample"/>
    </div>

    </>
);
}