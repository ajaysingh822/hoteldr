import { useState } from 'react'
import './App.css'
import {  Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/user/Login.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
<Route path="/" element={<Login />} />

    </Routes>
    </>
  )
}

export default App
