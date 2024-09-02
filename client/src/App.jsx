import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MerchantDashboard from './Components/MerchantDashboard';
import AdminDashboard from './Components/AdminDashboard';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import AdminLogin from './Pages/AdminLogin';
import Merchant from './Pages/Merchant';
import AdminProducts from './Pages/AdminProducts';
import Test from './Pages/Test';

import AdminGuestRoute from './Authentication/AdminGuestRoute';
import GuestRoute from './Authentication/GuestRoute';
import PrivateRoute from './Authentication/PrivateRoute';
import AdminRoute from './Authentication/AdminRoute';


function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route element={<AdminGuestRoute />} >
          <Route path='/admin-login' element={<AdminLogin />} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

        </Route>
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<MerchantDashboard />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/admin-dashboard/merchants' element={<Merchant />} />
          <Route path='/admin-dashboard/stocks' element={<AdminProducts />} />
        </Route>
        <Route path='/test' element={<Test />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
