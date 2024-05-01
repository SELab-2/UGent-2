import {JSX, useState} from "react";
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

function TableJoinedGroup(props: { project: ProjectStudent }): JSX.Element {
    const {t} = useTranslation();

    return (
        <div className={"pt-5"}>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label
                        className="label">{"> " + t('project.groupmembers.tag') + " (" + props.project.groupMembers?.length + "/" + props.project.maxGroupMembers + "):"}
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
                        {props.project.groupMembers?.map((member, index) => {
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
                <button className={"button"}>
                    <IoExitOutline size={25}/>
                </button>
            </div>
        </div>
    )
}

function JoinGroup(props: { project: ProjectStudent }): JSX.Element {
    // const {t} = useTranslation();

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
                            <td> {props.project.maxGroupMembers == member.amountOfMembers ?
                                // TODO: logic of this join button
                                <button className={"button"}><MdOutlinePersonAddAlt1/></button>
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

export default function ProjectStudentComponent(props: { project: ProjectStudent }): JSX.Element {


    // true als er een groep is, anders false.
    // zet onderstaande lijn aan (en volgen lijn uit) om te zien hoe het eruit ziet als je nog niet in een groep zit (even nog zo tot er echte data is)
    // const is_in_group = !(props.project.groupMembers && props.project.groupMembers.length > 0);
    const is_in_group = props.project.groupMembers && props.project.groupMembers.length > 0;

    const {t} = useTranslation();

    // let selectedFile: File | undefined = undefined; // TODO: initialize with actual file and export on save
    const [selectedFileName, setSelectedFileName] = useState<string | null>(props.project.submission);
    const [newSelectedFile, setNewSelectedFile] = useState<boolean>(false);

    function handleFileChange(files: FileList | null) {
        console.log(files);
        if (files !== null) {
            if (files.length > 0) {
                // selectedFile = files[0]; // uncommented for eslint error
                setSelectedFileName(files[0].name);
                setNewSelectedFile(true);
            }
        }
    }

    console.log(props.project)

    return (
        <div>
            {newSelectedFile &&
                <div>
                    <div className={"fixated is-flex is-justify-content-start"}>
                        <RegularButton
                            placeholder={t('project.save')}
                            add={false}
                            onClick={() => {
                            }}
                            styling="is-primary"
                        />
                    </div>
                    <div className="fixated-filler"/>
                </div>
            }
            {!is_in_group && props.project.maxGroupMembers > 1 &&
                <div className={"notification is-danger is-flex is-justify-content-center mx-5 my-3"}>
                    {t('project.not_in_group')}
                </div>
            }
            <ProjectInfo project={props.project}/>
            {!is_in_group && props.project.maxGroupMembers > 1 &&
                <JoinGroup project={props.project}/>
            }
            {is_in_group && props.project.groupMembers &&
                <TableJoinedGroup project={props.project}/>
            }
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{"> " + t('project.submission.tag') + ":"}</label>
                </div>
                <div className="field-body">
                    <ul className="field">
                        <div className="submission-file-download-upload">
                            {props.project.submission != null &&
                                <div className={"submission-file-download mb-3"}>
                                    {newSelectedFile
                                        ? <label className={"mr-3 highlight"}>{selectedFileName}</label>
                                        : <label className={"mr-3"}>{selectedFileName}</label>
                                    }
                                    <button className="button">
                                        <FaDownload/>
                                    </button>
                                </div>
                            }
                            <div id="file-js" className="field is-horizontal">
                                <label className="file-label">
                                    <input className="file-input" type="file" name="resume"
                                           onChange={e => handleFileChange(e.target.files)}/>
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
    );
}