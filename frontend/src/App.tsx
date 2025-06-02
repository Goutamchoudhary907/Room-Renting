import {  Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Signup } from './pages/auth/Signup'
import { Signin } from './pages/auth/Signin'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { useEffect, useState } from 'react'
import { ListRoom } from './pages/property/ListRoom'
import { MyProperties } from './pages/property/MyProperties'
import { EditRoom } from './pages/property/EditRoom'
import { Home } from './pages/Home'

import { AuthProvider } from './context/AuthContext' 
import { AllRooms } from './pages/property/AllRooms'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoomDetails } from './pages/property/RoomDetails'
import { Booking } from './components/Booking/Booking'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer/Footer'
import { AboutUs } from './pages/info/AboutUs'
import { ContactUs } from './pages/info/ContactUs'
import { PrivacyPolicy } from './pages/info/PrivacyPolicy'
import { TermsOfService } from './pages/info/TermsOfService'
import { LoadingProvider } from './context/LoadingContext';
function App() {
const location=useLocation();
const [routeKey, setRouteKey] = useState(location.pathname); // Initialize with current pathname

useEffect(() => {
    setRouteKey(location.pathname); // Update routeKey whenever location changes
}, [location]);                     // Run this effect when location changes

  return (
    <LoadingProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
<AuthProvider>
  <Navbar/>
    <Routes location={location} key={routeKey}>

    <Route path="/" element={<Home/>}/>

      <Route path="/auth/signup" element={<Signup/>}/>
      <Route path="/auth/signin" element={<Signin/>}/>
      <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/auth/reset-password" element={<ResetPassword/>}/>


      <Route path="/property/all-rooms" element={<AllRooms/>}/>
      <Route path="/property/room-detail/:id" element={<RoomDetails/>}/>
      
      <Route path="/about" element={<AboutUs/>}/>
      <Route path="/contact" element={<ContactUs/>}/>
      <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
      <Route path="/terms-of-service" element={<TermsOfService/>}/>
      
      <Route element={<ProtectedRoute />}>
      <Route path="/property/create" element={<ListRoom/>}/>
      <Route path="/property/edit/:id" element={<EditRoom/>}/>
      <Route path="/property/my/properties" element={<MyProperties/>}/>

      <Route path="/book/:id" element={<Booking />} />
      </Route>

     </Routes>
     <Footer/>
     </AuthProvider>
      </GoogleOAuthProvider>
      </LoadingProvider>
    
  )
}

export default App
