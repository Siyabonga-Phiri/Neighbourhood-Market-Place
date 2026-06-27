import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import FeedDashboard from "./components/FeedDashboard";
import Layout from "./components/header_footer/Layout";
import ProviderDashboard from "./components/provider_components/ProviderDashboard";
import CreateService from "./components/provider_components/CreateService";
import BecomeProvider from "./components/provider_components/BecomeProvider";
import PostRequest from "./components/PostRequest";
import RequestResponses from "./components/request_components/RequestResponses";
import Profile from "./components/Profile";


import './App.css'

function App() {

  return(

<Layout>
   <Routes>

    <Route path="/" element={<HomePage />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Register" element={<Register />} />
    <Route path="/feed" element={<FeedDashboard />} />
    <Route path="/provider/dashboard" element={<ProviderDashboard />} />
    <Route path="/services/create"  element={<CreateService />}/>
    <Route path="/provider/register" element={<BecomeProvider />}/>
    <Route path="/request" element={<PostRequest />} />
    <Route path="/requests/:requestId/responses" element={<RequestResponses />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/services/edit/:id" element={<CreateService />} />
      <Route path="/requests/edit/:id" element={<PostRequest />} />
      <Route path="/provider/:userId" element={<Profile />} />
  </Routes>
</Layout>
 


    
  );
  

}

export default App
