import ControlPannel from "./components/ControlPannel";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

export default function Gallery() {
  const { page } = useParams();
  return (
    <>
    <ControlPannel/>
    <div className="content content-grid">
      <h1>Gallery {page}</h1>
      <Pagenation currentPage={page}/>
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