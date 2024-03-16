import IUser from "../api_responses/IUser.ts"

export type AuthContextType = {
    isAuthenticated: boolean,
    user?: IUser,
    token?: string,
    login: (user?: IUser, token?: string) => void,
    logout: () => void
};