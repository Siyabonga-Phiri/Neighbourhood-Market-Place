import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import FeedDashboard from "./components/FeedDashboard";
import Layout from "./components/header_footer/Layout";

import CreateService from "./components/provider_components/CreateService";
import BecomeProvider from "./components/provider_components/BecomeProvider";
import PostRequest from "./components/PostRequest";
import RequestResponses from "./components/request_components/RequestResponses";
import Profile from "./components/Profile";
import AdminLayout from "./components/admin_components/AdminLayout";
import AdminDashboard from "./components/admin_components/AdminDashboard";
import ManageUsers from "./components/admin_components/ManageUsers";
import ManageServices from "./components/admin_components/ManageServices";
import ManageBookings from "./components/admin_components/ManageBookings";
import ManageRequests from "./components/admin_components/ManageRequests";
import ProtectedRoute from "./components/admin_components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/feed" element={<FeedDashboard />} />
       
        <Route path="/services/create" element={<CreateService />} />
        <Route path="/provider/register" element={<BecomeProvider />} />
        <Route path="/request" element={<PostRequest />} />
        <Route
          path="/requests/:requestId/responses"
          element={<RequestResponses />}
        />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/services/edit/:id" element={<CreateService />} />
        <Route path="/requests/edit/:id" element={<PostRequest />} />
        <Route path="/provider/:userId" element={<Profile />} />

        {/* -----------------ADMIN ROUTES-----------------------------------------------------------*/}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="requests" element={<ManageRequests />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
