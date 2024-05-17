import {ChangeEvent, JSX, useEffect, useState} from "react";
import FieldWithLabel from "./FieldWithLabel.tsx";
import {FaCheck, FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";
import {ProjectStatus, ProjectStudent} from "../types/project.ts";
import SimpleTests from "./SimpleTests/SimpleTests.tsx";
import {TeacherOrStudent} from "./SimpleTests/TeacherOrStudentEnum.tsx";
import {useTranslation} from 'react-i18next';
import {RegularButton} from "./RegularButton.tsx";
import {IoExitOutline} from "react-icons/io5";
import {MdOutlinePersonAddAlt1} from "react-icons/md";
import {Submission} from "../utils/ApiInterfaces.ts";
import {DEBUG} from "../pages/root.tsx";
import {make_submission} from "../utils/api/Submission.ts";
import {joinGroup, leaveGroup} from "../utils/api/Groups.ts";
import apiFetch from "../utils/ApiFetch.ts";
import {Backend_submission, Backend_user} from "../utils/BackendInterfaces.ts";

function ProjectInfo(props: { project: ProjectStudent }): JSX.Element {
    const {t} = useTranslation();

    return (
        <div className={"pt-5"}>
            <FieldWithLabel fieldLabel={t('project.name')} fieldBody={props.project.projectName} arrow={true}/>
            <FieldWithLabel fieldLabel={t('project.course')} fieldBody={props.project.courseName} arrow={true}/>
            <FieldWithLabel fieldLabel={t('project.deadline')} fieldBody={props.project.deadline} arrow={true}/>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{"> "}Status: </label>
                </div>
                <div className="field-body field">
                    {props.project.status == ProjectStatus.FAILED &&
                        <label className={"has-text-danger"}>{t('project.failed')}</label>}
                    {props.project.status == ProjectStatus.SUCCESS &&
                        <label className={"has-text-success"}>{t('project.success')}</label>}
                    {props.project.status == ProjectStatus.PENDING &&
                        <label>—</label>}
                </div>
            </div>
            <FieldWithLabel fieldLabel={"> " + t('project.description')}
                            fieldBody={props.project.description} arrow={false}/>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{"> " + t('project.submission_files') + ":"}</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <SimpleTests
                            teacherOrStudent={TeacherOrStudent.STUDENT}
                            initialData={props.project.requiredFiles}
                            setData={undefined}
                            setHasChanged={undefined}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

async function loadGroupMembers(project_id: number) {
    const groupIdData = await apiFetch<{ id: number }>(`/projects/${project_id}/group`)
    if (!groupIdData.ok) {
        return undefined;
    }
    const groupId: number = groupIdData.content.id;

    const submissionData = await apiFetch<Backend_submission>(`/groups/${groupId}/submission`)
    if (!submissionData.ok) {
        return undefined;
    }

    const lastSubmissionId = submissionData.content.student_id;

    const groupMembersIdData = await apiFetch<[{ id: number }]>(`/groups/${groupId}/members`);
    if (!groupMembersIdData.ok) {
        return undefined
    }
    const groupMembersId = groupMembersIdData.content
    const groupMembers = await Promise.all(groupMembersId.map(async (id_object) => {
        const user = await apiFetch<Backend_user>(`/users/${id_object.id}`);

        return {
            name: user.content.name,
            email: user.content.email,
            lastSubmission: user.content.id == lastSubmissionId
        }
    }))
    return {members: groupMembers, id: groupId, submission: submissionData.content.filename.split('/').reverse()[0]}
}

async function getGroupInfo(project_id: number) {
    const groups = await apiFetch<[{ id: number }]>(`/projects/${project_id}/groups`)
    if (!groups.ok) {
        return undefined
    }
    const groupsInfo = await Promise.all(groups.content.map(async id_obj => {
        const groupData = await apiFetch<[{ id: number }]>(`/groups/${id_obj.id}/members`)
        return {
            nr: id_obj.id,
            amountOfMembers: groupData.content.length
        }
    }))
    return groupsInfo
}

export default function ProjectStudentComponent(props: { project: ProjectStudent }): JSX.Element {
    const {t} = useTranslation();

    const [newSelectedFile, setNewSelectedFile] = useState<boolean>(false);
    const [file, setFile] = useState<File | undefined>(undefined)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    const [hasGroup, setHasGroup] = useState<boolean>((props.project.groupMembers || false) && props.project.groupMembers.length > 0)
    const [groupId, setGroupId] = useState(props.project.group_id);
    const [groupMembers, setGroupMembers] = useState<{
        name: string;
        email: string;
        lastSubmission: boolean;
    }[] | undefined>(props.project.groupMembers);
    const [submission, setSubmission] = useState(props.project.submission)
    const [groupInfo, setGroupInfo] = useState(undefined)


    function TableJoinedGroup(props: {
        groupMembers: {
            name: string,
            email: string,
            lastSubmission: boolean
        }[],
        maxGroupMembers: number
    }): JSX.Element {
        const {t} = useTranslation();
        return (
            <div className={"pt-5"}>
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label
                            className="label">{"> " + t('project.groupmembers.tag')

                            + " (" + props.groupMembers.length + "/" + props.maxGroupMembers + "):"}
                        </label>
                    </div>
                    <div className="field-body field">
                        <table className={"table is-fullwidth"}>
                            <thead>
                            <tr>
                                <th>{t('project.groupmembers.name')}</th>
                                <th>{t('project.groupmembers.email')}</th>
                                <th>{t('project.groupmembers.latest_submission')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.groupMembers.map((member, index) => {
                                return (<tr key={index}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.lastSubmission ? <FaCheck/> : "-"}</td>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"is-flex is-justify-content-end is-align-items-center"}>
                    <p className={"mx-3"}>leave group: </p>
                    <button className={"button"} onClick={() => {
                        void leaveGroup(groupId)
                        setGroupMembers([])
                        setGroupId(-1)
                        setSubmission('')
                        setHasGroup(false)
                        //navigate(0)
                    }}>
                        <IoExitOutline size={25}/>
                    </button>
                </div>
            </div>
        )
    }

    function JoinGroup(): JSX.Element {
        // const {t} = useTranslation();
        //const groupMembers = await loadGroupMembers(props.project_id)
        useEffect(() => {
            if (groupInfo == undefined) {

            }
        }, []);
        const data: { nr: number, amountOfMembers: number }[] = [
            {
                nr: 1,
                amountOfMembers: 4
            },
            {
                nr: 2,
                amountOfMembers: 3
            },
            {
                nr: 3,
                amountOfMembers: 0
            }
        ]
        return (
            <div className="field is-horizontal">
                <div className="field-label">
                    <label
                        className="label"> Beschikbare groepen
                    </label>
                </div>
                <div className={"field-body field"}>
                    <table className={"table is-fullwidth"}>
                        <thead>
                        <tr>
                            <th>nummmer</th>
                            <th>aantal leden</th>
                            <th>aansluiten</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((member, index) => {
                            return (<tr key={index}>
                                <td>{member.nr}</td>
                                <td>{member.amountOfMembers}</td>
                                <td> {props.project.maxGroupMembers > member.amountOfMembers ?
                                    // TODO: logic of this join button
                                    <button className={"button"} onClick={async () => {
                                        console.log("here")
                                        await joinGroup(member.nr);
                                        const group = await loadGroupMembers(props.project.projectId)
                                        console.log(group)
                                        if (group) {
                                            setHasGroup(group.id > -1)
                                            setGroupMembers(group.members)
                                            setSubmission(group.submission || "submission.zip")
                                            setGroupId(group.id || -1)
                                        }
                                    }}><MdOutlinePersonAddAlt1/></button>
                                    :
                                    <p>—</p>
                                }
                                </td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    async function submitFile() {
        if (file !== undefined) {
            const submission: string | Submission = await make_submission(groupId, file)
            if (typeof submission === 'string') {
                setError(submission) // TODO translation
                setSuccess('')
            } else {
                setNewSelectedFile(false)
                setSuccess("The submission has been successful") // TODO translation
                setError('')
            }
        }
    }

    function selectFile(event: ChangeEvent<HTMLInputElement>) {
        if (event.target?.files) {
            setFile(event?.target?.files[0])
            setNewSelectedFile(true);
        }
    }

    async function downloadLatestSubmission() {
        let url = ''
        if (DEBUG) {
            url = 'http://localhost:8000'
        }
        const response = await fetch(
            `${url}/api/groups/${groupId}/submission/file`,
            {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}
        )
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = submission ?? "submission.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div>
            <ProjectInfo project={props.project}/>
            {error && <div className="notification is-danger" style={{width: "75%"}}>
                {error}
            </div>}
            {success && <div className="notification is-success" style={{width: "75%"}}>
                {success}
            </div>}
            {!hasGroup && props.project.maxGroupMembers > 1 &&
                <div>
                    <div className={"notification is-danger is-flex is-justify-content-center mx-5 my-3"}>
                        {t('project.not_in_group')}
                    </div>
                    <JoinGroup/>
                </div>
            }

            {hasGroup && groupMembers &&
                <>
                    <TableJoinedGroup groupMembers={groupMembers} maxGroupMembers={props.project.maxGroupMembers}/>
                    <div className="field is-horizontal">
                        <div className="field-label">
                            <label className="label">{"> " + t('project.submission.tag') + ":"}</label>
                        </div>
                        <div className="field-body">
                            <ul className="field">
                                <div className="submission-file-download-upload">
                                    {submission != null &&
                                        <div className={"submission-file-download mb-3"}>
                                            {newSelectedFile
                                                ? <label className={"mr-3 highlight"}>{file?.name}</label>
                                                : <label className={"mr-3"}>{file?.name}</label>}
                                            <button className="button" onClick={downloadLatestSubmission}>
                                                <FaDownload/>
                                            </button>
                                        </div>}
                                    <div id="file-js" className="field is-horizontal">
                                        <label className="file-label">
                                            <input className="file-input" type="file" name="resume"
                                                   onChange={selectFile}/>
                                            <span className="file-cta">
                                                <span className="file-icon"><FaUpload/></span>
                                                <span
                                                    className="file-label">{t('project.submission.choose_file')}</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </ul>
                        </div>

                        {newSelectedFile &&
                            <div>
                                <div className={"is-flex is-justify-content-start"}>
                                    <RegularButton
                                        placeholder={t('project.save')}
                                        add={false}
                                        onClick={submitFile}
                                        styling="is-primary"/>
                                </div>
                                <div className="fixated-filler"/>
                            </div>}
                    </div>
                </>}

            <div className="p-5"/>

        </div>
    );
}