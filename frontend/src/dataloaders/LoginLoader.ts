import {User} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/api/ApiFetch.ts";

export const LOGIN_ROUTER_ID = "login";

export interface loginLoaderObject {
    user: User | undefined
}

export default async function loginLoader(): Promise<loginLoaderObject> {
    const token = localStorage.getItem('token')
    if (token) {
        const user = (await apiFetch('/user')) as User;
        return {user: user}
    } else {
        return {user: undefined}
    }
}