import {JSX, useState} from "react";
import Inputfield from "./Inputfield.tsx";
import {SelectionBox} from "./SelectionBox.tsx";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export function CreateProject(): JSX.Element {
    // of je de kalender moet tonen
    const [showDate, setShowDate] = useState(false);

    //info van de kalender: https://www.npmjs.com/package/react-calendar
    const handleCheckboxChange = () => {
        setShowDate(!showDate);
    };
    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];

    // waardes van de deadline
    const [calenderValue, handleCalenderChange] = useState<Value>(new Date());

    //helper
    const hours = Array.from({length: 24}, (_, index) =>
        index.toString().padStart(2, '0')
    );

    //helper
    const minutes = Array.from({length: 60}, (_, index) =>
        index.toString().padStart(2, '0')
    );

    return (
        <>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Project naam:</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <Inputfield placeholder="Geef een naam in"/>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Vak:</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <SelectionBox options={["vak1", "vak2", "vak3"]}/>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Deadline:</label>
                </div>
                <div className="field-body">
                    <label className="checkbox">
                        <input type="checkbox" onChange={handleCheckboxChange}/>
                        {showDate &&
                            <>
                                <Calendar onChange={handleCalenderChange} value={calenderValue}/>
                                <div className="is-horizontal">
                                    <div className="field">
                                        <SelectionBox options={hours}/>
                                        <label className={"title ml-3 mr-3"}>:</label>
                                        <SelectionBox options={minutes}/>

                                    </div>
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
                <div className="field-body">
                    <div className="field">
                        <div style={{width: "33%"}}>
                            <textarea className="textarea" placeholder="beschrijving"/>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
        ;
}