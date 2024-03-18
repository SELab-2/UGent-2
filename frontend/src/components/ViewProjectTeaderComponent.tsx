import {JSX, useState} from "react";
import Inputfield from "./Inputfield.tsx";
import {SelectionBox} from "./SelectionBox.tsx";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {FaUpload} from "react-icons/fa";
import "../assets/styles/small_components.css";

type ValuePiece = Date | null; // nodig voor de deadline
type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline

export function ViewProjectTeaderComponent(props: {
    projectName: string, setProjectName: React.Dispatch<React.SetStateAction<string>>,
    courseName: string, setCourseName: React.Dispatch<React.SetStateAction<string>>,
    hours: string, setHours: React.Dispatch<React.SetStateAction<string>>, //TODO dit aanpassen naar number
    minutes: string, setMinutes: React.Dispatch<React.SetStateAction<string>>, //TODO dit aanpassen naar number
    deadline: Value, setDeadline: React.Dispatch<React.SetStateAction<Value>>, // TODO dit aanpassen naar Date of iets anders
    description: string, setDescription: React.Dispatch<React.SetStateAction<string>>,
    requiredFiles: string, setRequiredFiles: React.Dispatch<React.SetStateAction<string>>,
    otherFilesAllow: boolean, setOtherFilesAllow: React.Dispatch<React.SetStateAction<boolean>>,
    groupProject: boolean, setGroupProject: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {

    // helpers
    const [showCalender, setCalender] = useState(props.deadline !== null);
    const [showGroup, setGroup] = useState(props.groupProject);

    const expandDeadline = () => {
        setCalender(!showCalender);
    };

    const expandGroup = (checked: boolean) => {
        setGroup(!showGroup);
        props.setGroupProject(checked);
    };

    const hours_array = Array.from({length: 24}, (_, index) => index.toString().padStart(2, '0'));
    const minutes_array = Array.from({length: 60}, (_, index) => index.toString().padStart(2, '0'));


    return (
        <>
            {/* PROJECT NAME FIELD */}
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Project naam:</label>
                </div>
                <div className="field-body field">
                    <Inputfield placeholder="Geef een naam in" value={props.projectName}
                                setValue={props.setProjectName}/>
                </div>
            </div>
            {/* COURSE NAME FIELD */}
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Vak:</label>
                </div>
                <div className="field-body field">
                    <SelectionBox options={["vak1", "vak2", "vak3"]} value={props.courseName}
                                  setValue={props.setCourseName}/>
                </div>
            </div>
            {/* DEADLINE FIELD */}
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Deadline:</label>
                </div>
                <div className="field-body">
                    <label>
                        <input type="checkbox" onChange={expandDeadline} checked={showCalender}/>
                        {showCalender &&
                            <>
                                <Calendar onChange={e => props.setDeadline(e)} value={props.deadline}/>
                                <div className="is-horizontal field">
                                    <SelectionBox options={hours_array} value={props.hours} setValue={props.setHours}/>
                                    <label className={"title ml-3 mr-3"}>:</label>
                                    <SelectionBox options={minutes_array} value={props.minutes}
                                                  setValue={props.setMinutes}/>
                                </div>
                            </>
                        }
                    </label>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Beschrijving:</label>
                </div>
                <div className="field-body field">
                    <div style={{width: "33%"}}> {/* Deze moet er blijven, anders doet css raar*/}
                        <textarea className="textarea" placeholder="Optionele beschrijving van het project"
                                  value={props.description}
                                  onChange={e => props.setDescription(e.target.value)}/>
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
                                    value={props.requiredFiles}
                                    setValue={props.setRequiredFiles}/>
                        <br/>
                        <div className="field is-horizontal">
                            <div className="field-label">
                                <input type="checkbox" onChange={e => props.setOtherFilesAllow(e.target.checked)}
                                       checked={props.otherFilesAllow}/>
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
                               checked={props.groupProject}/>
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
        </>
    )
        ;
}