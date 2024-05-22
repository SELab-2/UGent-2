import useAuth from "../../hooks/useAuth.ts";
import {Navigate, Outlet, useLocation} from "react-router-dom";

interface Props {
    allowedRoles?: string[]
}

const RequireAuth = ({allowedRoles}: Props) => {
    const {user} = useAuth();
    const location = useLocation();
    if (user) {
        return (
            (allowedRoles && user.user_roles.find(role => allowedRoles.includes(role)))
                ? <Outlet/>
                : <Navigate to={"/unauthorized"} state={{from: location}} replace/>
        );
    } else {
        return <Navigate to={"/login"} state={{from: location}} replace/>;
    }
}
export default RequireAuth;