import {User} from "../utils/ApiInterfaces.ts";
import {Backend_user} from "../utils/BackendInterfaces.ts";
import {mapUser} from "../utils/ApiTypesMapper.ts";
import apiFetch from "../utils/ApiFetch.ts";

export const LOGIN_ROUTER_ID = "login";

export interface loginLoaderObject {
    user: User | undefined
}

const isUser = (data?: Backend_user) => {
    return (data && data.id && data.name && data.email && data.roles && data.language);

}

export default async function loginLoader(): Promise<loginLoaderObject> {
    const token = localStorage.getItem('token')
    if (token) {
        const user = (await apiFetch('/user')) as Backend_user;
        if (isUser(user)) {
            return {user: mapUser(user)}
        }
    }
    return {user: undefined}

}