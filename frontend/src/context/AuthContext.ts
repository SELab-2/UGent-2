import {createContext} from "react";
import {AuthContextType} from "../types/auth.ts";

export const AuthContext = createContext<AuthContextType>(
    {
        isAuthenticated: false,
        login: () => {},
        logout: () => {}
    });


