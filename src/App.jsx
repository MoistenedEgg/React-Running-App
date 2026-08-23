import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import MainPage from './pages/MainPage'
import { UserProvider } from './contexts/UserContext'

function App() {

  return (
    <>
      <UserProvider>
        <MainPage/>
      </UserProvider>
    </>
  )
}

export default App
