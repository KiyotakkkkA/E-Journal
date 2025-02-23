import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import AdminRoute from "./components/routes/AdminRoute";
import AuthorizedRoute from "./components/routes/AuthorizedRoute";
import Groups from "./pages/common/services/Groups";
import STSchedules from "./pages/common/services/Schedule";
import ServicesMenu from "./pages/common/ServicesMenu";
import Attendance from "./pages/common/services/Attendance";
import Requests from "./pages/admin/services/Requests";
import OrgStructure from "./pages/admin/services/OrgStructure";
import Disciplines from "./pages/admin/services/Disciplines";
import FileManager from "./pages/admin/services/FileManager";
import Schedule from "./pages/admin/services/Schedule";
import Auditories from "./pages/admin/services/Auditories";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminMenu from "./pages/admin/AdminMenu";
import Teachers from "./pages/admin/services/Teachers";
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
                    path="/admin/teachers"
                    element={
                        <AdminRoute>
                            <Teachers />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/disciplines"
                    element={
                        <AdminRoute>
                            <Disciplines />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/structure"
                    element={
                        <AdminRoute>
                            <OrgStructure />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/data"
                    element={
                        <AdminRoute>
                            <FileManager />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/schedule"
                    element={
                        <AdminRoute>
                            <Schedule />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/auditoriums"
                    element={
                        <AdminRoute>
                            <Auditories />
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
                        <AuthorizedRoute>
                            <Main />
                        </AuthorizedRoute>
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
                <Route
                    path="/services/schedule"
                    element={
                        <AuthorizedRoute>
                            <STSchedules />
                        </AuthorizedRoute>
                    }
                />
                <Route
                    path="/services/attendance"
                    element={
                        <AuthorizedRoute>
                            <Attendance />
                        </AuthorizedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
