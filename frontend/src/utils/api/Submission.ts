import {mapSubmission} from "../ApiTypesMapper.ts";
import apiFetch from "../ApiFetch.ts";
import {Backend_submission} from "../BackendInterfaces.ts";

export async function make_submission(groupId: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const submissionData = (await apiFetch<Backend_submission>(`/groups/${groupId}/submission`,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: formData
        }));

    console.log('file submission', submissionData.status_code)
    if (submissionData.ok) {
        return mapSubmission(submissionData.content)
    }
}
