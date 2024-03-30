import {DEBUG} from "../pages/root.tsx";


const ApiFetch = async (url: string, options?: RequestInit) => {
    if (typeof options === 'undefined') {
        options = {}
    }

    const token = localStorage.getItem('token')
    if (token) {
        options.headers = {
            ...options.headers,
            'cas': token
        }
    }

    url = "/api" + url;
    if (DEBUG) {
        url = "http://127.0.0.1:8000" + url;
    }
    return (await fetch(url, options)).json()
}

export default ApiFetch