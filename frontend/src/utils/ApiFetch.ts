const DEBUG: boolean = false; // should always be false on the repo.

export default function apiFetch(url: string, options?: RequestInit) {
    if (typeof options === 'undefined') {
        options = {}
    }
    url = "/api" + url;
    if (DEBUG) {
        url = "http://127.0.0.1:8000" + url;
    }
    // TODO: add auth things in options
    return fetch(url, options)
}