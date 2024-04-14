import {JSX} from "react";
import FieldWithLabel from "./FieldWithLabel.tsx";
import {FaCheck, FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";
import {ProjectStatus, ProjectStudent} from "../types/project.ts";
import SimpleTests from "./SimpleTests/SimpleTests.tsx";
import {dummy_data} from "./SimpleTests/DummyData.tsx";
import {TeacherOrStudent} from "./SimpleTests/TeacherOrStudentEnum.tsx";

// SimpleTests
const calledData = dummy_data

export default function ProjectStudentComponent(props: { project: ProjectStudent }): JSX.Element {

    // true als er een groep is, anders false.
    const group = props.project.groupMembers && props.project.groupMembers.length > 0;

    return (
        <>
            {!group &&
                <div className="notification is-danger" style={{width: "75%"}}>
                    Je hebt nog geen groep, gelieve jezelf in te schrijven om zo aan dit project te kunnen beginnen.
                </div>
            }
            <FieldWithLabel fieldLabel={"Naam"} fieldBody={props.project.projectName} arrow={true}/>
            <FieldWithLabel fieldLabel={"Vak"} fieldBody={props.project.courseName} arrow={true}/>
            <FieldWithLabel fieldLabel={"Deadline"} fieldBody={props.project.deadline} arrow={true}/>
            {group &&
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{"> "}Status: </label>
                    </div>
                    <div className="field-body field">
                        {props.project.status == ProjectStatus.FAILED &&
                            <label className={"has-text-danger"}>{props.project.status}</label>}
                        {props.project.status == ProjectStatus.SUCCESS &&
                            <label className={"has-text-success"}>{props.project.status}</label>}
                    </div>
                </div>
            }
            <FieldWithLabel fieldLabel={"Beschrijving"} fieldBody={props.project.description} arrow={false}/>
            {group &&
                <div>
                    <div className="field is-horizontal">
                        <div className="field-label">
                            <label className="label">Indiening(zip) moet bevatten:</label>
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

                    {props.project.groupMembers !== undefined &&
                        <div className="field is-horizontal">

                            <div className="field-label">
                                <label
                                    className="label">Groepsleden({props.project.groupMembers.length}/{props.project.maxGroupMembers}): </label>
                            </div>
                            <div className="field-body field">
                                <table className={"table is-fullwidth"}>
                                    <thead>
                                    <tr>
                                        <th>Naam</th>
                                        <th>Email</th>
                                        <th>Laatste indiening</th>
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
                    }
                    <div className="field is-horizontal">
                        <div className="field-label">
                            <label className="label">Indiening(zip): </label>
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
                                            <span className="file-label">Kies een bestand</span>
                                    </span>
                                            <span className="file-name">This_is_the_file.zip</span>
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="columns is-mobile is-centered column is-half">
                        <button className="button is-medium is-center" style={{backgroundColor: "#9c9afd"}}>Bevestigen
                        </button>
                    </div>
                </div>
            }
        </>

    );

}