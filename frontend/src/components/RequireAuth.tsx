import useAuth from "../hooks/useAuth.ts";
import {useLocation, Outlet, Navigate} from "react-router-dom";

interface Props {
    allowedRoles?: string[]
};
const RequireAuth = ({allowedRoles}: Props) => {
    const {isAuthenticated, user} = useAuth()
    const location = useLocation();
    return (
        isAuthenticated
            ? (allowedRoles && user?.roles?.find(role => allowedRoles.includes(role))
                ? <Outlet/>
                : <Navigate to={"/unauthorized"} state={{from: location}} replace/>)
            : <Navigate to={"/login"} state={{from: location}} replace/>

    );
}

export default RequireAuth;