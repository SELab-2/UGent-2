import useAuth from "../../hooks/useAuth.ts";
import {Navigate, Outlet, useLocation} from "react-router-dom";

interface Props {
    allowedRoles?: string[]
}

const RequireAuth = ({allowedRoles}: Props) => {
    const {user,} = useAuth();
    const location = useLocation();

    return (
        (user) ?
            (allowedRoles && user.roles && user.roles.find(role => allowedRoles.includes(role))
                ? <Outlet/>
                : <Navigate to={"/unauthorized"} state={{from: location}} replace/>)
            : <Navigate to={"/login"} state={{from: location}} replace/>
    );
}

export default RequireAuth;