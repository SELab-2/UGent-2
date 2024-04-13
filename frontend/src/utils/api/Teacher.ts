import {Backend_Subject} from "../BackendInterfaces.ts";
import apiFetch from "../ApiFetch.ts";
import {Subject} from "../ApiInterfaces.ts";
import {mapSubject} from "../ApiTypesMapper.ts";

export async function createSubject(name: string): Promise<Subject> {
    const subjectData = (await apiFetch<Backend_Subject>('/teacher/subjects',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({name: name})
        }));

    if (subjectData.ok){
        return mapSubject(subjectData.content);
    }else{
        // TODO: error handling
        throw subjectData.status_code
    }
}