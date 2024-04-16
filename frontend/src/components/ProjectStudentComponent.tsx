import {JSX} from "react";
import FieldWithLabel from "./FieldWithLabel.tsx";
import {FaCheck, FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";
import {ProjectStatus, ProjectStudent} from "../types/project.ts";
import SimpleTests from "./SimpleTests/SimpleTests.tsx";
import { dummy_data } from "./SimpleTests/DummyData.tsx";
import { TeacherOrStudent } from "./SimpleTests/TeacherOrStudentEnum.tsx";
import { useTranslation } from 'react-i18next';

// SimpleTests
const calledData = dummy_data

export default function ProjectStudentComponent(props: { project: ProjectStudent }): JSX.Element {
    
    const { t } = useTranslation();
    
    return (
        <>
            <FieldWithLabel fieldLabel={t('project.name')} fieldBody={props.project.projectName} arrow={true}/>
            <FieldWithLabel fieldLabel={t('project.course')} fieldBody={props.project.courseName} arrow={true}/>
            <FieldWithLabel fieldLabel={t('project.deadline')} fieldBody={props.project.deadline} arrow={true}/>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{"> " + t('project.status') + ":"} </label>
                </div>
                <div className="field-body field">
                    {props.project.status == ProjectStatus.FAILED &&
                        <label className={"has-text-danger"}>{props.project.status}</label>}
                    {props.project.status == ProjectStatus.SUCCESS &&
                        <label className={"has-text-success"}>{props.project.status}</label>}
                </div>
            </div>
            <FieldWithLabel fieldLabel={"> " + t('project.description')} fieldBody={props.project.description} arrow={false}/>
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
                    <label className="label">
                        {"> " + t('project.groupmembers.tag') + " (" + props.project.groupMembers.length + "/" + props.project.maxGroupMembers + "):"} 
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
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{"> " + t('project.submission.tag') + ":"}</label>
                </div>
                <div className="field-body">
                    <ul className="field"> {/* Deze moet blijven */}
                        {props.project.submission != null &&
                            <li className={"mb-3"}>
                                <label className={"mr-3"}>{props.project.submission}</label>
                                <button className="button">
                                    <FaDownload/>
                                </button>
                            </li>
                        }
                        <li>
                            <div className="field is-horizontal">
                                <label className="file-label">
                                    <input className="file-input" type="file" name="resume"/>
                                    <span className="file-cta">
                                            <span className="file-icon"><FaUpload/></span>
                                            <span className="file-label">{t('project.submission.choose_file')}</span>
                                    </span>
                                    <span className="file-name">This_is_the_file.zip</span>
                                </label>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="columns is-mobile is-centered column is-half">
                <button className="button is-medium is-center" style={{backgroundColor: "#9c9afd"}}>{t('project.confirm')}</button>
            </div>
        </>
    );
}