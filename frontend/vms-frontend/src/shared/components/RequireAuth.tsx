import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRole }: { allowedRole: String }) => {
    const auth = useAuth();
    const location = useLocation();

    return (
        auth?.role == allowedRole
            ? <Outlet />
            : auth.isLoggedIn
                ? <Navigate to="/" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth