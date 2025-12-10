import ControlPannel from "./components/ControlPannel";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
export default function ImageEditor() {
  const { id } = useParams();
  
  return (
    <>
    <ControlPannel title={"ImageEditor"}/>
    <div className="content content-grid">
      <h1>ImageEditor {id}</h1>
    </div>

    </>
);
}