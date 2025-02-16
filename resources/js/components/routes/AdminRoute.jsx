import { Navigate } from "react-router-dom";

const AdminRoute = ({ canViewAdminPanel, children }) => {
    if (!canViewAdminPanel) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
