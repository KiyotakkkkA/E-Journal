import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import AdminRoute from "./components/routes/AdminRoute";
import AuthorizedRoute from "./components/routes/AuthorizedRoute";
import Groups from "./pages/common/services/Groups";
import ServicesMenu from "./pages/common/ServicesMenu";
import Requests from "./pages/admin/services/Requests";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminMenu from "./pages/admin/AdminMenu";
import UserPage from "./pages/User";
import NotFound from "./pages/NotFound";
import Main from "./pages/Main";
import { useAuth } from "./contexts/AuthContext";

export default function BrowseRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} />
            <Routes>
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminMenu />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/requests"
                    element={
                        <AdminRoute>
                            <Requests />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/user"
                    element={
                        <PrivateRoute>
                            <UserPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Main />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/services"
                    element={
                        <AuthorizedRoute>
                            <ServicesMenu />
                        </AuthorizedRoute>
                    }
                />
                <Route
                    path="/services/groups"
                    element={
                        <AuthorizedRoute>
                            <Groups />
                        </AuthorizedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
