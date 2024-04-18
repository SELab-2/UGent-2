/* TODO: When this function is implemented --> so that type file is known
export async function make_submission(groupId: number, file: File) {
const submissionData = (await apiFetch<Backend_submission>(`/groups/${groupId}/submission`,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: JSON.stringify({file: file})
    }));
if (submissionData.ok){
    return mapSubmission(submissionData.content)
}
}
 */
