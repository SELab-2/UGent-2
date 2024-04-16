import apiFetch from "../utils/ApiFetch.ts";
import {Backend_user} from "../utils/BackendInterfaces.ts";
import {mapUser} from "../utils/ApiTypesMapper.ts";
import {User} from "../utils/ApiInterfaces.ts";


export const ADMIN_LOADER = "ADMIN_LOADER";

export interface AdminLoaderObject {
    users: User[];
}

export default async function adminLoader(): Promise<AdminLoaderObject> {
    const users_backend: Backend_user[] = (await apiFetch("/api/users")) as Backend_user[];
    const users: User[] = users_backend.map((user) => mapUser(user));
    return {users};
}
