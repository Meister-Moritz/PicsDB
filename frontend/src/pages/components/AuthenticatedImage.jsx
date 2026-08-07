import { useState, useEffect } from "react";
import {serveImage} from "../../static/functions/TalkToBackend";

export default function AuthenticatedImage({ imgID, OGimg = false, suffix, className, alt }) {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {makeTmpURL(imgID, OGimg, suffix, setImageSrc)},[imgID, OGimg, suffix])
    return <img className={className} src={imageSrc} alt={alt} />;
}

async function makeTmpURL(imgID, OGimg, suffix, setImageSrc){

    const response = await serveImage(imgID, OGimg, suffix)
    if (response.ok) {
        // Convert image binary data to a temporary browser blob URL
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
    }
}