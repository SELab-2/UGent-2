import {DEBUG} from "../pages/root.tsx";

export interface ApiFetchResponse<Type>{
    ok: boolean,
    status_code: number,
    content: Type
}

export async function ApiFetch<Type> (url: string, options?: RequestInit) {
    if (typeof options === 'undefined') {
        options = {}
    }

    const token = localStorage.getItem('token')
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': 'Bearer ' + token
        }
    }

    url = "/api" + url;
    if (DEBUG) {
        url = "http://127.0.0.1:8000" + url;
    }
    const response = await fetch(url, options)

    if (response.status === 401){
        localStorage.removeItem('token')
    }

    return {
        ok: response.ok,
        status_code: response.status,
        content: response.status !== 204 ? await response.json() as Type : {}
    } as ApiFetchResponse<Type>
}

export default ApiFetch
