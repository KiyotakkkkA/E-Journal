import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ isAuthenticated, children }) => {
    const location = useLocation();
    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    if (isAuthenticated && isAuthPage) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PublicRoute;
