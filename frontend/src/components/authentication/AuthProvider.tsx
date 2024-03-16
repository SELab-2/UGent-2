import {ReactNode, useState} from "react";
import {AuthContext} from "../../context/AuthContext.ts";
import User from "../../utils/ApiInterfaces.ts";

interface Props {
    children?: ReactNode
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}: Props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<User | undefined>(undefined)
    const [token, setToken] = useState<string | undefined>(undefined)

    const login = (user?: User, token?: string) => {
        if (user && token) {
            setUser(user);
            setToken(token);
            setIsAuthenticated(true);
        }else{
            setIsAuthenticated(false);
        }
    }

    const logout = () => {
        setUser(undefined)
        setToken(undefined)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{login, logout, isAuthenticated, user, token}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;