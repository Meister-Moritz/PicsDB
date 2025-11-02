import { useLocation } from "react-router-dom";


export default function ControlPannel() {
    const location = useLocation();
    let pannel = <GalleryPannel />;

    if ( location.pathname.toLowerCase().includes("gallery") ){
        pannel = <GalleryPannel />
    }
    else if (location.pathname.toLowerCase().includes("imageeditor")) {
        pannel = <EditorPannel />
    }

  return (
    <div className="ControlPannel">
    <h1>ControlPannel</h1>
    {pannel}
    </div>
);
}

function GalleryPannel(){
return (<h2>GalleryPannel</h2>)
}

function EditorPannel(){
return (<h2>EditorPannel</h2>)
}
