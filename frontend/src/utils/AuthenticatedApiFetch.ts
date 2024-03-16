const DEBUG: boolean = false; // should always be false on the repo.

const authenticatedApiFetch = async (url: string, token: string | undefined, options?: RequestInit,) => {
    if (typeof options === 'undefined') {
        options = {}
    }
    if (token) {
        options.headers = {
            ...options.headers,
            'cas': token
        }
    }

    if (DEBUG) {
        url = "http://127.0.0.1:8000" + url;
    }
    return await fetch(url, options)
}

export default authenticatedApiFetch