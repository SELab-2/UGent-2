import User from "../utils/ApiInterfaces.ts";

export type AuthContextType = {
    isAuthenticated: boolean,
    user?: User,
    token?: string,
    login: (user?: User, token?: string) => void,
    logout: () => void
};