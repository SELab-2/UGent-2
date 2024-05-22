import {mapSubmission} from "../ApiTypesMapper.ts";
import apiFetch from "../ApiFetch.ts";
import {Backend_submission} from "../BackendInterfaces.ts";
import {Submission} from "../ApiInterfaces.ts";

export interface ErrorMsg {
    detail: string
}

export async function make_submission(groupId: number, file: File): Promise<string | Submission> {
    if (groupId < 0) {
        throw Error('Not a valid group id!')
    }
    const formData = new FormData()
    formData.append('file', file)
    const submissionData = (await apiFetch(`/groups/${groupId}/submission`,
        {
            method: 'POST',
            body: formData
        }));
    if (submissionData.ok) {
        return mapSubmission(submissionData.content as Backend_submission)
    }
    return (submissionData.content as ErrorMsg).detail
}
