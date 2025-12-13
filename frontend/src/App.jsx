import { createContext, useContext, useState } from 'react'
import './static/CSS/GeneralLayout.css'
import './static/CSS/GeneralDesign.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Gallery from './pages/Gallery';
import ImageViewer from './pages/ImageViewer';
import ImageEditor from './pages/ImageEditor';
import Settings from './pages/Settings';
import Login from './pages/Login';


export const QueryContext = createContext();

export function QueryProvider({ children }) {
  const [search, setSearch] = useState({
    searchTags: [],
    page: 1,
  });

  return (
    <QueryContext.Provider value={{ search, setSearch }}>
      {children}
    </QueryContext.Provider>
  );
}

export function useSearch() {
  return useContext(QueryContext);
}

export default function App(){
    
    return (
        <div className='myBody'>
        <QueryProvider>
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
        </QueryProvider>
        </div>
    )
}
