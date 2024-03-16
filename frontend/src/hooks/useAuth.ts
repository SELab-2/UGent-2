import {useContext} from "react";
import AuthContext from "../components/authentication/AuthProvider.tsx";

const useAuth = () => {
    return useContext(AuthContext)
}

export default useAuth