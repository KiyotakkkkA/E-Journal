import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AuthorizedRoute = ({ children }) => {
    const { roles } = useAuth();

    if (!roles.isStudent && !roles.isTeacher && !roles.isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AuthorizedRoute;
