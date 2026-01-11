import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Header from './Component/Header/Header'
import Footer from './Component/Footer/Footer'
import About from './Pages/About'
import Contact from "./Pages/About"
import Payment from './Pages/Payment'
import PaymentSuccess from './Pages/PaymentSuccess'
import Home from './Pages/Home'
import  {UserData } from './Context/UserContext.jsx'
import Login from './Pages/Login'
import Signup from './Pages/Sinup'
import Otp from './Pages/Otp'
import Course from './Pages/Course'
import AccountPage from './Pages/Acount'
import LecturesPage from './Pages/Lectures'
import AdminDashboard from './Pages/AdminDashboard'
import AdminSetup from './Pages/AdminSetup'
import PaymentDebug from './Pages/PaymentDebug'

import PromoteUser from './Pages/PromoteUser'
import MyCourse from './Pages/MyCourse'
import { Toaster } from "react-hot-toast";
import LoadingPage from './Component/Loading.jsx'



function App() {
   const {isAuth,loading}= UserData();

  return (
    <>
      {loading?(<LoadingPage/>):(
      <BrowserRouter>
      <Toaster/>
        <Header isAuth={isAuth} />
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About/>} />
          <Route path='/login' element={isAuth? <Home/>:<Login/>} />
          <Route path='/signup' element={isAuth?<Home/>:<Signup/>} />
          <Route path='/otp' element={<Otp/>} />
          <Route path='/course' element={<Course/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/mycourse' element={isAuth?<MyCourse/>:<Login/>} />
          <Route path='/payment/:courseId' element={<Payment/>} />
          <Route path='/payment-success' element={<PaymentSuccess/>} />
          <Route path='/account' element={ isAuth ?<AccountPage/>:<Login/>} />
          <Route path='/lectures/:courseId' element={<LecturesPage/>} />
          <Route path='/admin' element={ <AdminDashboard/>} />
          <Route path='/admin-setup' element={<AdminSetup/>} />
          <Route path='/payment-debug' element={<PaymentDebug/>} />
         
          <Route path='/promote-user' element={<PromoteUser/>} />
        </Routes>
       <Footer/>
      </BrowserRouter>
     )}
    </>
  )
}

export default App
