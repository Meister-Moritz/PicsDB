import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
export default function ImageViewer() {
  const { id } = useParams();
  
  return (
    <>
    <div className="content content-grid">
      <h1>ImageViewer {id}</h1>
    </div>

    </>
);
}