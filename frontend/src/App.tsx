import {  Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Signup } from './components/Signup'
import { Signin } from './components/Signin'
import { ForgotPassword } from './components/ForgotPassword'
import { ResetPassword } from './components/ResetPassword'
import { useEffect, useState } from 'react'
import { ListRoom } from './components/Property/ListRoom/ListRoom'
import { MyProperties } from './components/Property/MyProperties'
import { EditRoom } from './components/Property/EditRoom/EditRoom'
import { Home } from './components/Home/Home'

import { AuthProvider } from './context/AuthContext' 
import { AllRooms } from './components/AllRooms/AllRooms'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
const location=useLocation();
const [routeKey, setRouteKey] = useState(location.pathname); // Initialize with current pathname

useEffect(() => {
    setRouteKey(location.pathname); // Update routeKey whenever location changes
}, [location]);                     // Run this effect when location changes

  return (
     <AuthProvider>
    <Routes location={location} key={routeKey}>

    <Route path="/home" element={<Home/>}/>

      <Route path="/auth/signup" element={<Signup/>}/>
      <Route path="/auth/signin" element={<Signin/>}/>
      <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/auth/reset-password" element={<ResetPassword/>}/>


      <Route path="/property/all-rooms" element={<AllRooms/>}/>
      
      <Route element={<ProtectedRoute />}>
      <Route path="/property/create" element={<ListRoom/>}/>
      <Route path="/property/edit/:id" element={<EditRoom/>}/>
      <Route path="/property/my/properties" element={<MyProperties/>}/>
      </Route>

     </Routes>
     </AuthProvider>
  )
}

export default App
