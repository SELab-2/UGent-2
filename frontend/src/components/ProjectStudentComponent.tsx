/* eslint-disable @typescript-eslint/no-unsafe-assignment, no-inner-declarations */
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
import getID from "./SimpleTests/IDProvider.tsx";

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

export default function ProjectStudentComponent(props: { project: ProjectStudent }): JSX.Element {
    const {t} = useTranslation();

    const [newSelectedFile, setNewSelectedFile] = useState<boolean>(false);
    const [file, setFile] = useState<File | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
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
            setError(undefined)
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
                setError(submission)
                setSuccess('')
            } else {
                setNewSelectedFile(false)
                setSuccess(t("project.submitted"))
                setError(undefined)
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

    class ParsedError {
        success: boolean;
        local_rows: ErrorRow[] | undefined;
        global_rows: ErrorRow[] | undefined;
        unparsed_error: string;
        constructor(
            success: boolean,
            local_rows: ErrorRow[] | undefined,
            global_rows: ErrorRow[] | undefined,
            unparsed_error: string
        ) {
            this.success = success;
            this.local_rows = local_rows;
            this.global_rows = global_rows;
            this.unparsed_error = unparsed_error;
        }
    }

    class ErrorRow {
        type: string;
        value: string | undefined;
        depth: number;
        success: boolean;
        constructor(
            type: string,
            value: string | undefined,
            depth: number,
            success: boolean,
        ) {
            this.type = type;
            this.value = value;
            this.depth = depth;
            this.success = success;
        }
    }

    interface StringDictionary {
        [key: string]: (string | boolean | StringDictionary | StringDictionary[] | null);
    }

    function tryParseError(error: string): ParsedError {
        try {
            const obj: StringDictionary = JSON.parse(error);
            const row_list_local: ErrorRow[] = [];
            const row_list_global: ErrorRow[] = [];

            function dfs(
                json: StringDictionary, 
                depth: number,
                local: boolean = true
            ) {
                const _type = json['type'] as string;
                const _depth = depth;
                const _success = json['is_ok'] as boolean;
                let   _value = undefined;
                if ('file_name'              in json) {_value = json['file_name'] as string}
                if ('zip_name'               in json) {_value = json['zip_name'] as string}
                if ('directory_name'         in json) {_value = json['directory_name'] as string}
                if ('file_or_directory_name' in json) {_value = json['file_or_directory_name'] as string}
                if ('not_present_extension'  in json) {_value = json['not_present_extension'] as string}
                if ('extension'              in json) {_value = json['extension'] as string}
                
                const row = new ErrorRow(_type, _value, _depth, _success);
                if (local) {
                    if (row.type !== "SUBMISSION")
                    row_list_local.push(row);
                } else {
                    row_list_global.push(row);
                }

                if ('root_constraint_result' in json) {
                    if (json['root_constraint_result'] !== null) {
                        const sub_obj = json['root_constraint_result'] as StringDictionary;
                        dfs(sub_obj, depth);
                    }
                }

                if ('sub_constraint_results' in json) {
                    if (json['sub_constraint_results'] !== null) {
                        const sub_objs = json['sub_constraint_results'] as StringDictionary[];
                        for (const sub_obj of sub_objs) {
                            dfs(sub_obj, depth+1);
                        }
                    }
                }

                if ('global_constraint_result' in json) {
                    if (json['global_constraint_result'] !== null) {
                        const sub_obj = json['global_constraint_result'] as StringDictionary;
                        dfs(sub_obj, 0, false);
                    }
                }

                if ('global_constraint_results' in json) {
                    if (json['global_constraint_results'] !== null) {
                        const sub_obj = json['global_constraint_results'] as StringDictionary;
                        for (const x of Object.keys(sub_obj).map(function(key){return sub_obj[key]})) {
                            dfs(x as StringDictionary, 0, false);
                        }
                    }
                }
                
            }

            dfs(obj, 0);

            return new ParsedError(true, row_list_local, row_list_global, error);

        } catch (e) {
            console.log(e)
            return new ParsedError(false, undefined, undefined, error);
        }
    }

    return (
        <div>
            <ProjectInfo project={props.project}/>
            {error && <div className="notification is-danger is-flex is-justify-content-center mx-5 my-3">
                <div className="rows">
                    <div className="row is-full">{t('project.failed-submission')}</div>
                    <br/>
                    <div className="row is-full">
                        {tryParseError(error).success
                            ? <div>
                                { tryParseError(error).global_rows?.length !== undefined && (tryParseError(error).global_rows?.length as number) > 1 &&
                                <div>
                                    <div>
                                    {tryParseError(error).global_rows?.map(row => 
                                            <div key={getID()} className="error-row">
                                                {"\u00A0".repeat(5 * row.depth)}
                                                {row.success
                                                    ? <div className="error-success">{row.type.toLocaleLowerCase()}: {row.value}</div>
                                                    : <div className="error-fail">{row.type.toLocaleLowerCase()}: {row.value}</div>
                                                }
                                            </div>
                                        )}
                                    </div>
                                    <br/>
                                </div>
                                }
                                <div>
                                    {tryParseError(error).local_rows?.map(row => 
                                        <div key={getID()} className="error-row">
                                            {"\u00A0".repeat(5 * row.depth)}
                                            {row.success
                                                ? <div className="error-success">{row.type.toLocaleLowerCase()}: {row.value}</div>
                                                : <div className="error-fail">{row.type.toLocaleLowerCase()}: {row.value}</div>
                                            }
                                        </div>
                                    )}
                                </div>
                              </div>
                            : <div>{error}</div>
                        }
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
