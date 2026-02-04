import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {

    const { isAuthenticated } = useSelector((state) => state.auth);
    console.log(isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children;
};

export default ProtectedRoutes;