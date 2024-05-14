import {ChangeEvent, JSX, useState} from "react";
import FieldWithLabel from "./FieldWithLabel.tsx";
import {FaCheck, FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";
import {ProjectStatus, ProjectStudent} from "../types/project.ts";
import SimpleTests from "./SimpleTests/SimpleTests.tsx";
import {TeacherOrStudent} from "./SimpleTests/TeacherOrStudentEnum.tsx";
import {useTranslation} from 'react-i18next';
import {make_submission} from "../utils/api/Submission.ts";
import {Submission} from "../utils/ApiInterfaces.ts";
import {DEBUG} from "../pages/root.tsx";
import {RegularButton} from "./RegularButton.tsx";
import { dummy_data } from "./SimpleTests/DummyData.tsx";


// SimpleTests
const calledData = dummy_data;

export default function ProjectStudentComponent(props: { project: ProjectStudent }): JSX.Element {


    // true als er een groep is, anders false.
    const is_in_group = props.project.groupMembers && props.project.groupMembers.length > 0;

    const {t} = useTranslation();
    const [file, setFile] = useState<File | undefined>(undefined)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')


    async function submitFile() {
        if (file !== undefined) {
            const submission: string | Submission = await make_submission(props.project.group_id, file)
            props.project.status = ProjectStatus.PENDING
            if (typeof submission === 'string') {
                setError(submission) // TODO translation
                setSuccess('')
                props.project.status = ProjectStatus.FAILED
            } else {
                setNewSelectedFile(false)
                props.project.status = ProjectStatus.SUCCESS
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
            `${url}/api/groups/${props.project.group_id}/submission/file`,
            {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}
        )
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = props.project.submission ?? "submission.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // let selectedFile: File | undefined = undefined; // TODO: initialize with actual file and export on save
    const [newSelectedFile, setNewSelectedFile] = useState<boolean>(false);

    return (
        <>
            {newSelectedFile &&
                <div>
                    <div className={"fixated is-flex is-justify-content-start"}>
                        <RegularButton
                            placeholder={t('project.save')}
                            add={false}
                            onClick={() => void submitFile()}
                            styling="is-primary"
                        />
                    </div>
                    <div className="fixated-filler"/>
                </div>
            }
            <div className="pt-3">
                {!is_in_group &&
                    <div className="notification is-danger" style={{width: "75%"}}>
                        {t('project.not_in_group')}
                    </div>
                }
                <FieldWithLabel fieldLabel={t('project.name')} fieldBody={props.project.projectName} arrow={true}/>
                <FieldWithLabel fieldLabel={t('project.course')} fieldBody={props.project.courseName} arrow={true}/>
                <FieldWithLabel fieldLabel={t('project.deadline')} fieldBody={props.project.deadline} arrow={true}/>
                {is_in_group &&
                    <div className="field is-horizontal">
                        <div className="field-label">
                            <label className="label">{"> "}Status: </label>
                        </div>
                        <div className="field-body field">
                            {props.project.status == ProjectStatus.FAILED &&
                                <label className={"has-text-danger"}>{t('project.failed')}</label>}
                            {props.project.status == ProjectStatus.SUCCESS &&
                                <label className={"has-text-success"}>{t('project.success')}</label>}
                            </div>
                    </div>
                }
                <FieldWithLabel fieldLabel={"> " + t('project.description')} fieldBody={props.project.description}
                                arrow={false}/>
                {is_in_group && props.project.groupMembers &&
                    <div>
                        <div className="field is-horizontal">
                            <div className="field-label">
                                <label className="label">{"> " + t('project.submission_files') + ":"}</label>
                            </div>
                            <div className="field-body">
                                <div className="field"> {/*Deze moet blijven, anders gaan de elementen in elkaar*/}
                                    <SimpleTests
                                        teacherOrStudent={TeacherOrStudent.STUDENT}
                                        initialData={calledData}
                                        setData={undefined}
                                        setHasChanged={undefined}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">

                            <div className="field-label">
                                <label
                                    className="label">{"> " + t('project.groupmembers.tag') + " (" + props.project.groupMembers.length + "/" + props.project.maxGroupMembers + "):"}
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
                                    {props.project.groupMembers.map((member, index) => {
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
                        {error &&
                            <div className="notification is-danger" style={{width: "75%"}}>
                                {error}
                            </div>
                        }
                        {success &&
                            <div className="notification is-success" style={{width: "75%"}}>
                                {success}
                            </div>
                        }
                        <div className="field is-horizontal">
                            <div className="field-label">
                                <label className="label">{"> " + t('project.submission.tag') + ":"}</label>
                            </div>

                            <div className="field-body">
                                <ul className="field"> {/* Deze moet blijven */}
                                    <div className="submission-file-download-upload">
                                        {props.project.submission != null &&
                                            <div className={"submission-file-download mb-3"}>
                                                {newSelectedFile
                                                    ? <label className={"mr-3 highlight"}>{file?.name}</label>
                                                    : <label className={"mr-3"}>{file?.name}</label>
                                                }
                                                <button className="button" onClick={() => void downloadLatestSubmission()}>
                                                    <FaDownload/>
                                                </button>
                                            </div>
                                        }

                                        <div id="file-js" className="field is-horizontal">
                                            <label className="file-label">
                                                <input className="file-input" type="file" name="resume"
                                                       onChange={e => selectFile(e)}/>
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
                        </div>
                        <div className="p-5"/>
                    </div>
                }
            </div>
        </>
    );
}