import {JSX} from "react";
import FieldWithLabel from "./FieldWithLabel.tsx";
import {FaCheck, FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";
import {ProjectStatus} from "../pages/student/ProjectView.tsx";

export default function ViewProjectStudent(props: {
    projectName: string,
    courseName: string,
    deadline: string,
    status: ProjectStatus,
    description: string,
    requiredFiles: string[],
    groupMembers: { name: string, email: string, lastSubmission: boolean }[],
    maxGroupMembers: number,
    submission: string | null
}): JSX.Element {
    return (
        <>
            <FieldWithLabel fieldLabel={"Naam"} fieldBody={props.projectName} arrow={true}/>
            <FieldWithLabel fieldLabel={"Vak"} fieldBody={props.courseName} arrow={true}/>
            <FieldWithLabel fieldLabel={"Deadline"} fieldBody={props.deadline} arrow={true}/>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{"> "}Status: </label>
                </div>
                <div className="field-body field">
                    {props.status == ProjectStatus.FAILED &&
                        <label className={"has-text-danger"}>{props.status}</label>}
                    {props.status == ProjectStatus.SUCCESS &&
                        <label className={"has-text-success"}>{props.status}</label>}
                </div>
            </div>
            <FieldWithLabel fieldLabel={"Beschrijving"} fieldBody={props.description} arrow={false}/>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Indiening(zip) moet bevatten:</label>
                </div>
                <div className="field-body">
                    <div className="field"> {/*Deze moet blijven, anders gaan de elementen in elkaar*/}
                        {props.requiredFiles.map((file, index) => {
                            return <li key={index}>{file}</li>
                        })}
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Groepsleden({props.groupMembers.length}/{props.maxGroupMembers}): </label>
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
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Indiening(zip): </label>
                </div>
                <div className="field-body">
                    <ul className="field"> {/* Deze moet blijven */}
                        {props.submission != null &&
                            <li className={"mb-3"}>
                                <label className={"mr-3"}>{props.submission}</label>
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
                <button className="button is-medium is-center" style={{backgroundColor: "#9c9afd"}}>Bevestigen</button>
            </div>
        </>
    );
}