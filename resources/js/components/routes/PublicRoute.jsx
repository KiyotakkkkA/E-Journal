import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    if (isAuthenticated && isAuthPage) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PublicRoute;
