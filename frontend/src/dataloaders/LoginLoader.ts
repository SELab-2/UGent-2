import {User} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/ApiFetch.ts";

export const LOGIN_ROUTER_ID = "login";

export interface loginLoaderObject {
    user: User | undefined
}

export default async function loginLoader(): Promise<loginLoaderObject> {
    const token = localStorage.getItem('token')
    let user = undefined
    if (token) {
        user = (await apiFetch('/user')
            .then(async response => {
                if (response.status == 200) {
                    return await response.json() as User;
                } else {
                    return undefined;
                }
            })
            .catch(() => {
                localStorage.removeItem('token')
            })) as User | undefined
        return {user: user}
    } else {
        return {user: undefined}
    }
}