import ControlPannel from "./components/ControlPannel";
import { useParams } from 'react-router-dom';
import { API_URL } from "../static/functions/TalkToBackend"
import { useState, useEffect } from 'react';
import '../static/CSS/ImageViewer.css'

export default function ImageViewer() {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(true)
  const [pannel, setPannel] = useState(<></>)
  const [imgDivClass, setImgDivClass] = useState('maxSize')


  useEffect(() => {
    if (showDetails){
      setPannel(<ControlPannel title={"ImageViewer"} details={{showDetails:showDetails, setShowDetails:setShowDetails}}/>)
      setImgDivClass('content-grid limitedSize')
    }
    else{
      setPannel(<></>)
      setImgDivClass('maxSize')
    }
  }, [showDetails]);


  return (
    <>
    {pannel}
    <div className={imgDivClass} onClick={() => setShowDetails(!showDetails)}>
      <img 
        className="fullImage" 
        key={id} 
        src={`${API_URL}/serveImage?imgID=${id}&OGimg=${true}&suffix=null`} 
        alt="Sample"
      />  
    </div>
    </>
);
}
