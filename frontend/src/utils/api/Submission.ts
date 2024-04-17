import apiFetch from "../ApiFetch.ts";
import {Backend_submission} from "../BackendInterfaces.ts";
import {mapSubmission} from "../ApiTypesMapper.ts";

export async function make_submission(groupId: number, file: string) {
    const submissionData = (await apiFetch<Backend_submission>(`/groups/${groupId}/submission`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({file: file})
        }));
    if (submissionData.ok){
        return mapSubmission(submissionData.content)
    }
}