import {JSX, useState} from "react";
import Inputfield from "./Inputfield.tsx";
import {SelectionBox} from "./SelectionBox.tsx";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {FaUpload} from "react-icons/fa";
import "../assets/styles/small_components.css";


export function CreateProject(): JSX.Element {
    const [showCalender, setCalender] = useState(false);
    type ValuePiece = Date | null; // nodig voor de deadline
    type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline
    const [deadlineValue, deadlineChange] = useState<Value>(new Date());
    const [description, setDescription] = useState('');
    const [showGroup, setGroup] = useState(false);

    const expandDeadline = () => {
        setCalender(!showCalender);
    };

    const expandGroup = () => {
        setGroup(!showGroup);
    };

    const hours = Array.from({length: 24}, (_, index) => index.toString().padStart(2, '0'));
    const minutes = Array.from({length: 60}, (_, index) => index.toString().padStart(2, '0'));


    return (
        <>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Project naam:</label>
                </div>
                <div className="field-body field">
                    <Inputfield placeholder="Geef een naam in"/>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Vak:</label>
                </div>
                <div className="field-body field">
                    <SelectionBox options={["vak1", "vak2", "vak3"]}/>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Deadline:</label>
                </div>
                <div className="field-body">
                    <label>
                        <input type="checkbox" onChange={expandDeadline}/>
                        {showCalender &&
                            <>
                                <Calendar onChange={e => deadlineChange(e)} value={deadlineValue}/>
                                <div className="is-horizontal field">
                                    <SelectionBox options={hours}/>
                                    <label className={"title ml-3 mr-3"}>:</label>
                                    <SelectionBox options={minutes}/>
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
                        <Inputfield placeholder="vb: diagram.dgr,verslag.pdf,textbestand.txt"/>
                        <br/>
                        <div className="field is-horizontal">
                            <div className="field-label">
                                <input type="checkbox"/> {/*TODO doe iets*/}
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
                        <input type="checkbox" onChange={expandGroup}/>
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