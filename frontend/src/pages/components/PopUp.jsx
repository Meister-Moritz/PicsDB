import { useNavigate } from "react-router-dom";
import { useSearch } from "../../App";

export function Confirm({text:text, setPopUp:setPopUp, deleteImg:deleteImg, param:param}){
    const navigate = useNavigate()
    const {search, setSearch } = useSearch()
    return(
        <div className="popup">
        <h1>{text}</h1>
        <button onClick={()=>{deleteImg(param); setPopUp(<></>); navigate(`/Gallery/page/${search.page}`)}}>Yes</button>
        <button onClick={()=>{setPopUp(<></>)}}>No</button>
        </div>
    )
}