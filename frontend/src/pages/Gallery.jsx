import ControlPannel from "./components/ControlPannel";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react"
import { sendQuery, API_URL } from "../static/functions/TalkToBackend"

export default function Gallery({queryState}) {
  const { query, setQuery } = queryState; 
  const { page } = useParams();
  const [results, setResults] = useState("")
  const totalPages = 99999
  const picsPerSite = 25
  const listOfImgPaths = Array(results.length)
  const navigate = useNavigate();
  let id;
  let suffix;

  useEffect(() => {
    setQuery(prev => ({ ...prev, page: Number(page) }));
  }, [page]);
  useEffect(() => {
    updateRes(query, setResults, picsPerSite)
  }, [query]); // [query] => whenever query changes run updateRes again

  for (let i = 0; i<results.length;i++){
    id = results[i][0]
    suffix = results[i][1]
    listOfImgPaths[i] = individualImage(id, suffix, navigate)
  }

  return (
    <>
    <ControlPannel title={"Gallery"}/>
    <div className="content content-grid">
      <h1>Gallery {query.page}</h1>
      <div className="images">
          {listOfImgPaths}
      </div>
      <Pagenation currentPage={query.page}/>
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


async function updateRes(query, setResult, picsPerSite){

    const queryWithPage = addPageToQuery(query, picsPerSite)
    const res = await sendQuery({query: queryWithPage, page: query.page});
    setResult(await res)

}



function individualImage(id, suffix, navigate){
  
    return (
    <div className="imgPrevBox" key={id} onClick={()=>navigate(`/ImageViewer/id/${id}`)}>
        <img className="imgPreview" key={id} src={`${API_URL}/serveImage?imgID=${id}&OGimg=${false}&suffix=${suffix}`} alt="Sample"/>
    </div>
    )
}

function addPageToQuery(query, picsPerSite){
    let queryWithPage = query.query
    const offset = picsPerSite * (query.page - 1)
    queryWithPage = queryWithPage + ` limit ${picsPerSite} offset ${offset}`
    return queryWithPage
}