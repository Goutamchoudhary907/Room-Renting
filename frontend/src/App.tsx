import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signup } from './components/Signup'
import { Signin } from './components/Signin'
import { ForgotPassword } from './components/ForgotPassword'
import { ResetPassword } from './components/ResetPassword'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/auth/signup" element={<Signup/>}/>
      <Route path="/auth/signin" element={<Signin/>}/>
      <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/auth/reset-password" element={<ResetPassword/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
