import apiFetch, {ApiFetchResponse} from "../utils/ApiFetch.ts";
import {Backend_user} from "../utils/BackendInterfaces.ts";
import {mapUser} from "../utils/ApiTypesMapper.ts";
import {User} from "../utils/ApiInterfaces.ts";


export const ADMIN_LOADER = "ADMIN_LOADER";

export interface AdminLoaderObject {
    users: User[]
}

export default async function adminLoader(): Promise<AdminLoaderObject> {
    const users_backend: ApiFetchResponse<Backend_user[]> = await apiFetch<Backend_user[]>("/users");

    let users: User[] = []
    if (users_backend.ok) {
        users = users_backend.content.map((user) => mapUser(user));
    }
    return {users};
}
