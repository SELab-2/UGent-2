import {ChangeEvent, JSX, useEffect, useRef, useState} from "react";
import FieldWithLabel from "./FieldWithLabel.tsx";
import {FaCheck, FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";
import {ProjectStatus, ProjectStudent} from "../types/project.ts";
import {useTranslation} from 'react-i18next';
import {RegularButton} from "./RegularButton.tsx";
import {IoExitOutline} from "react-icons/io5";
import {MdOutlinePersonAddAlt1} from "react-icons/md";
import {Submission} from "../utils/ApiInterfaces.ts";
import {DEBUG} from "../pages/root.tsx";
import {make_submission} from "../utils/api/Submission.ts";
import {joinGroup, leaveGroup} from "../utils/api/Groups.ts";
import {getGroupInfo, loadGroupMembers} from "../dataloaders/loader_helpers/SharedFunctions.ts";
import SimpleTests from "./SimpleTests/SimpleTests.tsx";
import {TeacherOrStudent} from "./SimpleTests/TeacherOrStudentEnum.tsx";

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
            {props.project.requiredFiles != null && <div className="field is-horizontal">
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
            </div>}
        </div>
    )
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
    const [groupInfo, setGroupInfo] = useState(props.project.groups_info)

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function TableJoinedGroup(props: {
        groupMembers: {
            name: string,
            email: string,
            lastSubmission: boolean
        }[],
        maxGroupMembers: number,
        project_id: number
    }): JSX.Element {
        const {t} = useTranslation();

        async function onLeaveClick() {
            await leaveGroup(groupId)
            const group_info = await getGroupInfo(props.project_id)
            setGroupInfo(group_info)
            setGroupMembers([])
            setGroupId(-1)
            setSubmission('')
            setHasGroup(false)
            setSuccess('')
            setError('')
            setFile(undefined)
            setNewSelectedFile(false)
        }

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
                    {<div className={"columns"}>

                        <p className={"mx-3"}>leave group: </p>
                        <button className={"button"} onClick={() => {
                            void onLeaveClick()
                        }}>
                            <IoExitOutline size={25}/>
                        </button>
                    </div>}
                </div>
            </div>
        )
    }

    function JoinGroup(): JSX.Element {
        // const {t} = useTranslation();
        //const groupMembers = await loadGroupMembers(props.project_id)
        useEffect(() => {
            async function updateGroupInfo() {
                const groups_info = await getGroupInfo(props.project.projectId)
                setGroupInfo(groups_info)
            }

            if (groupInfo == undefined) {
                void updateGroupInfo()
            }
        }, []);

        async function onJoinClick(groupId: number) {
            await joinGroup(groupId);
            const group = await loadGroupMembers(props.project.projectId)
            if (group) {
                setHasGroup(group.id > -1)
                setGroupMembers(group.members)
                setSubmission(group.submission || "submission.zip")
                setGroupId(group.id || -1)
            }
        }

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
                        {groupInfo && groupInfo.map((member, index) => {
                            return (<tr key={index}>
                                <td>{member.visible_id}</td>
                                <td>{member.member_count}</td>
                                <td> {props.project.maxGroupMembers > member.member_count ?
                                    <button className={"button"} onClick={() => {
                                        void onJoinClick(member.id)
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
                setSuccess(t("project.submitted"))
                setError('')
            }
            setFile(undefined);
            setNewSelectedFile(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    function selectFile(event: ChangeEvent<HTMLInputElement>) {
        if (event.target?.files) {
            setFile(event?.target?.files[0]);
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
            {error && <div className="notification is-danger is-flex is-justify-content-center mx-5 my-3">
                <div className="rows">
                    <div className="row is-full">{t('project.failed-submission')}</div>
                    <br/>
                    <div className="row is-full">
                        {error}
                    </div>
                </div>
            </div>}
            {success && <div className="notification is-success is-flex is-justify-content-center mx-5 my-3">
                {success}
            </div>}
            {!hasGroup &&
                <div>
                    <div className={"notification is-danger is-flex is-justify-content-center mx-5 my-3"}>
                        {t('project.not_in_group')}
                    </div>
                    <JoinGroup/>
                </div>
            }

            {hasGroup && groupMembers &&
                <>
                    <TableJoinedGroup project_id={props.project.projectId} groupMembers={groupMembers}
                                      maxGroupMembers={props.project.maxGroupMembers}/>
                    <div className="field is-horizontal">
                        <div className="field-label">
                            <label className="label">{"> " + t('project.submission.tag') + ":"}</label>
                        </div>
                        <div className="field-body">
                            <ul className="field">
                                <div className="submission-file-download-upload">
                                    {submission != null &&
                                        <button className="button" onClick={() => void downloadLatestSubmission()}>
                                            <span className="mr-2"><FaDownload/></span>
                                            <span>{t('project.download-current')}</span>
                                        </button>
                                    }
                                    <div id="file-js" className="field is-horizontal ">
                                        <label className="file-label">
                                            <input className="file-input" type="file" name="resume"
                                                   ref={fileInputRef}
                                                   onChange={selectFile}
                                            />
                                            <span className="file-cta file-chooser-first">
                                                <span className="file-icon">
                                                    <FaUpload/>
                                                </span>
                                                <span className="file-label">
                                                    {t('project.submission.choose_file')}
                                                </span>
                                            </span>
                                            {newSelectedFile &&
                                                <span className={"file-name mr-3 file-chooser-second"}>
                                                    {file?.name}
                                                </span>
                                            }
                                        </label>
                                    </div>
                                    {newSelectedFile && hasGroup &&
                                        <div className={"is-flex is-justify-content-end"}>
                                            <RegularButton
                                                placeholder={t('project.submit')}
                                                add={false}
                                                onClick={() => void submitFile()}
                                                styling="is-primary"/>
                                        </div>}
                                </div>
                            </ul>
                        </div>
                    </div>
                </>}
            <div className="p-5"/>
        </div>
    );
}
