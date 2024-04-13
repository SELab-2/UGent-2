import {Backend_Subject} from "../BackendInterfaces.ts";
import apiFetch from "../ApiFetch.ts";
import {Subject} from "../ApiInterfaces.ts";
import {mapSubject} from "../ApiTypesMapper.ts";

export async function createSubject(name: string): Promise<Subject> {
    const subjectData = (await apiFetch('/teacher/subjects',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({name: name})
        })) as Backend_Subject;
    return mapSubject(subjectData);
}