import useAuth from "../hooks/useAuth.ts";
import {DEBUG} from "../pages/root.tsx";


const ApiFetch = async (url: string, options?: RequestInit,) => {
    if (typeof options === 'undefined') {
        options = {}
    }
    const token = localStorage.getItem('token')
    const {logout} = useAuth()

    if (token) {
        options.headers = {
            ...options.headers,
            'cas': token
        }
    }

    //url = "/api" + url;
    if (DEBUG) {
        url = "http://127.0.0.1:8000" + url;
    }
  
    return fetch(url, options).then(response => {
        if (response.status == 401){
            logout()
        }
        return response
    })
}

export default ApiFetch