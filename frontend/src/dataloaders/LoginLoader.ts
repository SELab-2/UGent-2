import {User} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/ApiFetch.ts";
import {Backend_user} from "../utils/BackendInterfaces.ts";
import {mapUser} from "../utils/ApiTypesMapper.ts";

export const LOGIN_ROUTER_ID = "login";

export interface loginLoaderObject {
    user: User | undefined
}

export default async function loginLoader(): Promise<loginLoaderObject> {
    const token = localStorage.getItem('token')
    if (token) {
        const user_request = (await apiFetch<Backend_user>('/user'));
        if (user_request.ok) {
            return {user: mapUser(user_request.content)}
        }
    }
    return {user: undefined}

}