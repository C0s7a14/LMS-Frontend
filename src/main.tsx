import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './pages/auth/Login.tsx'
import Registro from './pages/auth/Register.tsx'
import ForgotPassword from './pages/auth/Forgotpassword.tsx'
import ResetPassword from './pages/auth/ResetPassword.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>



{/*
 <App />
<Registro/>
<ForgotPassword/>
<Login/>
*/}


<ResetPassword/>




  </StrictMode>,
)
