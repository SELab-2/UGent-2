import {Backend_Subject} from "../BackendInterfaces.ts";
import apiFetch from "../ApiFetch.ts";

export async function createSubject(name: string) {
    return (await apiFetch('/teacher/subjects',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({name: name})
        })) as Backend_Subject
}