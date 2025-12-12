import { useState } from 'react'
import './static/CSS/GeneralLayout.css'
import './static/CSS/GeneralDesign.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Gallery from './pages/Gallery';
import ImageViewer from './pages/ImageViewer';
import ImageEditor from './pages/ImageEditor';
import Settings from './pages/Settings';
import Login from './pages/Login';



export default function App(){
    const [query, setQuery] = useState({query: "select id, suffix from pics", page: 1});
    const queryState = { query, setQuery };
    
    return (
        <div className='myBody'>
        <BrowserRouter>
            <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Gallery/page/:page" element={<Gallery queryState = {queryState}/>} />
            <Route path="/ImageViewer/id/:id" element={<ImageViewer />} />
            <Route path="/ImageEditor/id/:id" element={<ImageEditor />} />
            <Route path="/Settings" element={<Settings />} />

            <Route path="/" element={<Navigate to="/Gallery/page/1" replace />} />
            </Routes>
        </BrowserRouter>
        </div>
    )
}
