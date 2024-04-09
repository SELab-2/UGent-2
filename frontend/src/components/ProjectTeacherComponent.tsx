import {JSX, useState} from "react";
import Inputfield from "./Inputfield.tsx";
import {SelectionBox} from "./SelectionBox.tsx";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {FaUpload} from "react-icons/fa";
import {ProjectTeacher, Value} from "../types/project.ts";
import "../assets/styles/teacher_components.css"

export function ProjectTeacherComponent(props: { project: ProjectTeacher }): JSX.Element {

    const [projectName, setProjectName] = useState<string>(props.project.projectName)
    const [courseName, setCourseName] = useState<string>(props.project.courseName)
    const [hours, setHours] = useState<number>(props.project.hours);
    const [minutes, setMinutes] = useState<number>(props.project.minutes);
    const [deadline, setDeadline] = useState<Value>(props.project.deadline);
    const [description, setDescription] = useState(props.project.description);
    const [requiredFiles, setRequiredFiles] = useState(props.project.requiredFiles);
    const [otherFilesAllow, setOtherFilesAllow] = useState(props.project.otherFilesAllow);
    const [groupProject, setGroupProject] = useState(props.project.groupProject);

    // helpers
    const [showCalender, setCalender] = useState(props.project.deadline !== null);
    const [showGroup, setGroup] = useState(props.project.groupProject);

    const expandDeadline = () => {
        setCalender(!showCalender);
    };

    const expandGroup = (checked: boolean) => {
        setGroup(!showGroup);
        setGroupProject(checked);
    };

    const hours_array = Array.from({length: 24}, (_, index) => index.toString().padStart(2, '0'));
    const minutes_array = Array.from({length: 60}, (_, index) => index.toString().padStart(2, '0'));


    return (
        <div className={"create-project"}>
            {/* PROJECT NAME FIELD */}
            <div className={"field is-horizontal"}>
                <div className={"field-label"}>
                    <label className="label">Project naam:</label>
                </div>
                <div className="field-body field">
                    <Inputfield placeholder="Geef een naam in" value={projectName}
                                setValue={setProjectName}/>
                </div>
            </div>
            {/* COURSE NAME FIELD */}
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Vak:</label>
                </div>
                <div className="field-body field">
                    <SelectionBox options={["vak1", "vak2", "vak3"]} value={courseName}
                                  setValue={setCourseName}/>
                </div>
            </div>
            {/* DEADLINE FIELD */}
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Deadline:</label>
                </div>
                <div
                    className="field-body is-flex is-flex-direction-column is-align-items-start is-justify-content-center">
                    <input type="checkbox" onChange={expandDeadline} checked={showCalender}/>
                    {showCalender &&
                        <div>
                            <div>
                                <Calendar onChange={e => setDeadline(e)} value={deadline}/>
                            </div>
                            <div className="is-horizontal field is-justify-content-center mt-2">
                                <SelectionBox options={hours_array} value={hours.toString()}
                                              setValue={setHours}/>
                                <label className={"title mx-3"}>:</label>
                                <SelectionBox options={minutes_array} value={minutes.toString()}
                                              setValue={setMinutes}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Beschrijving:</label>
                </div>
                <div className="field-body field">
                    <div style={{width: "33%"}}> {/* Deze moet er blijven, anders doet css raar*/}
                        <textarea className="textarea" placeholder="Optionele beschrijving van het project"
                                  value={description}
                                  onChange={e => setDescription(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Docker file:</label>
                </div>
                <div className="field-body field file has-name">
                    <label className="file-label">
                        <input className="file-input" type="file" name="resume"/>
                        <span className="file-cta">
                            <span className="file-icon">
                                <FaUpload/>
                            </span>
                            <span className="file-label">
                                Kies een bestand
                            </span>
                        </span>
                        <span className="file-name">
                            C:\home\files\docker_file.dockerfile
                        </span>
                    </label>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Indiening files:</label>
                </div>
                <div className="field-body field">
                    <div className="field"> {/* Deze moet er blijven, anders doet css raar*/}
                        <label>Specifieer welke files de ingediende zip moet bevatten. Splits per komma.</label>
                        <br/>
                        <Inputfield placeholder="vb: diagram.dgr,verslag.pdf,textbestand.txt"
                                    value={requiredFiles}
                                    setValue={setRequiredFiles}/>
                        <br/>
                        <div className="field is-horizontal">
                            <div className="field-label">
                                <input type="checkbox"
                                       onChange={e => setOtherFilesAllow(e.target.checked)}
                                       checked={otherFilesAllow}/>
                            </div>
                            <div className="field-body">
                                <label className="label is-fullwidth">ook andere files toegelaten</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Groepswerk:</label>
                </div>
                <div className="field-body">
                    <label>
                        <input type="checkbox" onChange={e => expandGroup(e.target.checked)}
                               checked={groupProject}/>
                        {showGroup &&
                            <>
                                <div className="field is-horizontal">
                                    <div className="field-label">
                                        <input type="checkbox"/>
                                    </div>
                                    <div className="field-body">
                                        <label className="label is-fullwidth">verwisselingen toestaan</label>
                                    </div>
                                </div>
                                <br/>
                                <div className="field-label">
                                    <label className="label is-fullwidth">Groepsindeling (kies 1 van
                                        onderstaande):</label>
                                </div>
                                <br/>
                                <div className="field-body field is-horizontal">
                                    <div className="field-label">
                                        <input type="checkbox"/>
                                    </div>
                                    <div className="field-body">
                                        <label className="label is-fullwidth">random</label>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div className="field-label">
                                        <input type="checkbox"/>
                                    </div>
                                    <div className="field-body">
                                        <label className="label is-fullwidth">studenten kiezen zelf</label>
                                    </div>
                                </div>
                            </>
                        }
                    </label>
                </div>
            </div>
        </div>
    )
        ;
}