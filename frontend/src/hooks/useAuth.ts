import {useContext} from "react";
import AuthContext from "../components/authentication/AuthProvider.tsx";
import {AuthContextType} from "../types/auth.ts";

const useAuth = () => {
    const result: AuthContextType = useContext(AuthContext);
    return result;
}

export default useAuth;