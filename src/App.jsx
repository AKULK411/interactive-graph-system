import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import MainPage from './pages/MainPage/MainPage'
import NotFound from'./pages/NotFound/NotFound'
import GraphPage from './pages/GraphPage/GraphPage'
import AboutPage from './pages/AboutPage/AboutPage'



function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<MainPage/>}/>
          <Route path='/Graph' element={<GraphPage/>}/>  
          <Route path='/About' element={<AboutPage/>}/>          
        </Route>
        <Route path='*' element={<NotFound/>}/>  
      </Routes>
    </>
  )
}

export default App
