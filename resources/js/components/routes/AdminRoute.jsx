import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminRoute = ({ children }) => {
    const { canViewAdminPanel } = useAuth();
    if (!canViewAdminPanel) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
