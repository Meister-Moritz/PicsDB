import { useNavigate } from "react-router-dom";
import { useSearch } from "../../App";

export function Confirm({text:text, setPopUp:setPopUp, deleteImg:deleteImg, param:param}){
    const navigate = useNavigate()
    const {search, setSearch } = useSearch()
    return(
        <div className="popup_wrapper">
            <div className="popup">
                <h1 className="popup_headline">{text}</h1>
                <div className="popup_footline">
                    <button className="popup_footline_left" onClick={()=>{setPopUp(<></>)}}>No</button>
                    <button className="popup_footline_right" onClick={()=>{deleteImg(param); setPopUp(<></>); navigate(`/Gallery/page/${search.page}`)}}>Yes</button>
                </div>
            </div>
        </div>

    )
}