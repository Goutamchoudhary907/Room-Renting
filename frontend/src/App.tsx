import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signup } from './components/Signup'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/auth/signup" element={<Signup/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
