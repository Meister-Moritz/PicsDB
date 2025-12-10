import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './static/CSS/GeneralLayout.css'
import './static/CSS/GeneralDesign.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Gallery from './pages/Gallery';
import ImageViewer from './pages/ImageViewer';
import ImageEditor from './pages/ImageEditor';
import Settings from './pages/Settings';
import Login from './pages/Login';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='myBody'>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Gallery/page/:page" element={<Gallery />} />
          <Route path="/ImageViewer/id/:id" element={<ImageViewer />} />
          <Route path="/ImageEditor/id/:id" element={<ImageEditor />} />
          <Route path="/Settings" element={<Settings />} />

          <Route path="/" element={<Navigate to="/Gallery/page/1" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>,
)
