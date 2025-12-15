import ControlPannel from "./components/ControlPannel";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react"
import { sendSearch, API_URL } from "../static/functions/TalkToBackend"
import { useSearch } from "../App";

export default function Gallery() {
  const { search, setSearch } = useSearch();
  const { page } = useParams();
  const [results, setResults] = useState("")
  const totalPages = 99999
  const picsPerSite = 25
  const listOfImgPaths = Array(results.length)
  const navigate = useNavigate();
  let id;
  let suffix;

  useEffect(() => {
    setSearch(prev => ({ ...prev, page: Number(page) }));
  }, [page]);
  useEffect(() => {
    updateRes(search, setResults)
  }, [search]); // [search] => whenever search changes run updateRes again

  for (let i = 0; i<results.length;i++){
    id = results[i][0]
    suffix = results[i][1]
    listOfImgPaths[i] = individualImage(id, suffix, navigate)
  }

  return (
    <>
    <ControlPannel title={"Gallery"}/>
    <div className="content content-grid">
      <h1>Gallery {search.page}</h1>
      <div className="images">
          {listOfImgPaths}
      </div>
      <Pagenation currentPage={search.page}/>
    </div>
    
    </>
);
}

function Pagenation({currentPage}){
  const navigate = useNavigate();
  const page = Number(currentPage)

  const prevPage = () => { 
    navigate("/gallery/page/"+(page-1));
  };
  const nextPage = () => {
    navigate("/gallery/page/"+(page+1));
  };
  const firstPage = () => { 
    navigate("/gallery/page/1");
  };
  const lastPage = () => {
    navigate("/gallery/page/999999");
  };

  return(
    <div className="pagination">
        <table>
        <tbody>
            <tr>
                <td><button onClick={firstPage}>First</button></td>

                {
                page >1
                ? <td><button onClick={prevPage}>Previous</button></td> 
                : <td></td>
                }

                <td>Page {page} of {999999}</td>

                {
                page < 999999
                ? <td><button onClick={nextPage}>Next</button></td> 
                : <td></td>
                }
                
                <td><button onClick={lastPage}>Last</button></td>
            </tr>
        </tbody>
        </table>
    </div>
  );
}


async function updateRes(search, setResult){

    const res = await sendSearch(search);
    setResult(await res)

}



function individualImage(id, suffix, navigate){
  
    return (
    <div className="imgPrevBox" key={id} onClick={()=>navigate(`/ImageViewer/id/${id}`)}>
        <img className="imgPreview" key={id} src={`${API_URL}/serveImage?imgID=${id}&OGimg=${false}&suffix=${suffix}`} alt="Sample"/>
    </div>
    )
}
