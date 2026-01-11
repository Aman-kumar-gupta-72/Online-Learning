import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from "./Context/UserContext.jsx";
import { CourseContextProvider } from './Context/CourseContext.jsx';
import { LectureContextProvider } from './Context/LectureContext.jsx';

import { Import } from 'lucide-react';


export const API = Import.Meta.env.VITE_API_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <UserContextProvider>
      <CourseContextProvider>
        <LectureContextProvider>
          <App />
        </LectureContextProvider>
      </CourseContextProvider>
    </UserContextProvider>
 
  </StrictMode>,
)
