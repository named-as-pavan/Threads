import { useState } from 'react'
import './App.css'
import { Box, Button } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import { Routes, useLocation } from 'react-router-dom'
import { Route,Navigate } from 'react-router-dom'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import userAtom from '../atom/userAtom'
import authScreenAtom from '../atom/authAtom'
import { useRecoilValue } from 'recoil'
import LogoutButton from './components/LogoutButton'
// import React from 'react'
import UpdateProfilePage from './pages/UpdateProfilePage'
import CreatePost from './components/CreatePost'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'

function App() {

  const { pathname } = useLocation()


  const user = useRecoilValue(userAtom);

  return (
    <Box position={'relative'} w={'full'}>

    

    <Container maxW={pathname === "/" ? {base:"620px" ,  md:"900pxx"} : "620px"}>
      <Header/>
      <Routes>
        <Route path = "/" element={user ? <HomePage/> : <Navigate to ="/auth"/>}/>
        <Route path = "/auth" element={!user ? <AuthPage/> : <Navigate to='/'/>}/>
        <Route path = "/update" element={user ? <UpdateProfilePage/> : <Navigate to='/auth'/>}/>
        <Route path = "/:username" element={user ? (<>
          <UserPage/>
      <CreatePost/>
      </>): ( <UserPage/>)}/>
        <Route path = "/:username/:post/:pid" element={<PostPage/>}/>
        <Route path = "/chat" element={user ? <ChatPage/> : <Navigate to={'/auth'}/>}/>
        <Route path = "/settings" element={user ? <SettingsPage/> : <Navigate to={'/auth'}/>}/>
      </Routes>

    </Container>
    </Box>

  )
}

export default App
