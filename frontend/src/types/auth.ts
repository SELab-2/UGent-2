import {User} from "../utils/ApiInterfaces.ts";

export type AuthContextType = {
    user?: User,
    to?: string,
    loading: boolean
    login: () => void,
    ticketLogin: (token: string) => void,
    logout: () => void,
};