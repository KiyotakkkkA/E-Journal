import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/app.css";
import Header from "./components/Header";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import AdminRoute from "./components/routes/AdminRoute";
import Groups from "./pages/admin/services/Groups";
import Requests from "./pages/admin/services/Requests";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Admin from "./pages/admin/Admin";
import UserPage from "./pages/User";
import NotFound from "./pages/NotFound";
import Main from "./pages/Main";
import axios from "./axios";
const checkAuth = async () => {
    try {
        const response = await axios.get("/api/check-auth");
        return response.data;
    } catch (error) {
        return false;
    }
};

const Layout = ({ isAuthenticated, canViewAdminPanel, isStudent }) => {
    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} />
            <Routes>
                <Route
                    path="/admin/requests"
                    element={
                        <AdminRoute canViewAdminPanel={canViewAdminPanel}>
                            <Requests canViewAdminPanel={canViewAdminPanel} />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/groups"
                    element={
                        <AdminRoute canViewAdminPanel={canViewAdminPanel}>
                            <Groups canViewAdminPanel={canViewAdminPanel} />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute canViewAdminPanel={canViewAdminPanel}>
                            <Admin canViewAdminPanel={canViewAdminPanel} />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute isAuthenticated={isAuthenticated}>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute isAuthenticated={isAuthenticated}>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/user"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <UserPage
                                canViewAdminPanel={canViewAdminPanel}
                                isStudent={isStudent}
                            />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <Main canViewAdminPanel={canViewAdminPanel} />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob([
            "./layouts/*.jsx",
            "./components/*.jsx",
            "./pages/*.jsx",
        ]);
        return pages;
    },
    setup({ el, App, props }) {
        checkAuth().then((data) => {
            const root = createRoot(el);
            root.render(
                <Layout
                    isAuthenticated={data.isAuthenticated}
                    canViewAdminPanel={data.canViewAdminPanel}
                    isStudent={data.isStudent}
                >
                    <App {...props} />
                </Layout>
            );
        });
    },
});
