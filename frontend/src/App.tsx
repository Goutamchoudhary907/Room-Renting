import {  Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Signup } from './components/Signup'
import { Signin } from './components/Signin'
import { ForgotPassword } from './components/ForgotPassword'
import { ResetPassword } from './components/ResetPassword'
import { useEffect, useState } from 'react'
import { ListRoom } from './components/Property/ListRoom'

function App() {
const location=useLocation();
const [routeKey, setRouteKey] = useState(location.pathname); // Initialize with current pathname

useEffect(() => {
    setRouteKey(location.pathname); // Update routeKey whenever location changes
}, [location]);                     // Run this effect when location changes

  return (
    <>
    <Routes location={location} key={routeKey}>
      <Route path="/auth/signup" element={<Signup/>}/>
      <Route path="/auth/signin" element={<Signin/>}/>
      <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/auth/reset-password" element={<ResetPassword/>}/>
      <Route path="/property/create" element={<ListRoom/>}/>
     </Routes>
    </>
  )
}

export default App
