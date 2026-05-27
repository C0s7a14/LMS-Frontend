import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './pages/auth/Login.tsx'
import Registro from './pages/auth/Register.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>



{/*


 <App />


<Login/>




*/}


<Registro/>




  </StrictMode>,
)
