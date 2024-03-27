import {JSX} from "react";
import '../../assets/styles/simple_checks.css'
import { useState } from 'react';
import { SelectionBox } from "../../components/SelectionBox";
import { TbArrowRightBar } from "react-icons/tb";

export default function HomeAdmin(): JSX.Element {
    
    const [checked, setChecked] = useState<Boolean>(false);

    function handleCheckbox(checkbox: {target: {checked: Boolean}}) {
        setChecked(checkbox.target.checked);
    }

    type Constraint = {"type": string, "name": string, "sub_constraints"?: Constraint[]}

    const test_structure: Constraint = {
        "type": "zip_constraint",
        "name": "root.zip",
        "sub_constraints": [
            {
                "type": "directory_constraint",
                "name": "Documents",
                "sub_constraints": [
                    {
                        "type": "file_constraint",
                        "name": "Resume.pdf"
                    },
                    {
                        "type": "directory_constraint",
                        "name": "Other",
                        "sub_constraints": [
                            {
                                "type": "file_constraint",
                                "name": "ResumeNL.pdf"
                            },
                            {
                                "type": "file_constraint",
                                "name": "ResumeEN.pdf"
                            }
                        ]
                    },
                    {
                        "type": "directory_constraint",
                        "name": "Other2",
                        "sub_constraints": [
                            {
                                "type": "file_constraint",
                                "name": "Transcript.pdf"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "directory_constraint",
                "name": "Images",
                "sub_constraints": [
                    {
                        "type": "file_constraint",
                        "name": "Vacation.jpg"
                    },
                    {
                        "type": "file_constraint",
                        "name": "ProfilePicture.jpg"
                    }
                ]
            },
            {
                "type": "directory_constraint",
                "name": "Videos",
                "sub_constraints": [
                    {
                        "type": "file_constraint",
                        "name": "Graduation.mp4"
                    }
                ]
            },
            {
                "type": "not_present_constraint",
                "name": "file4.txt"
            }
        ]
    }
    
    function parse(structure: Constraint): JSX.Element[] {
        let lines: JSX.Element[] = []
        if (structure.sub_constraints) {
            parseSubs(structure.sub_constraints, lines)
        }
        return lines;
    }

    function parseSubs(structures: Constraint[], lines: JSX.Element[], before: string = "") {
        let i = 0;
        for (let structure of structures) {
            if (i < structures.length - 1) {
                if (structure.sub_constraints) {
                    lines.push(<div>{before + "├─\u00A0" + structure.name}<button>+</button></div>)
                    parseSubs(structure.sub_constraints, lines, before + "\u00A0|\u00A0\u00A0\u00A0\u00A0")
                } else {
                    lines.push(<div>{before + "├─\u00A0" + structure.name}</div>)
                }
            } else {
                if (structure.sub_constraints) {
                    lines.push(<div>{before + "└─\u00A0" + structure.name}<button>+</button></div>)
                    parseSubs(structure.sub_constraints, lines, before + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")
                } else {
                    lines.push(<div>{before + "└─\u00A0" + structure.name}</div>)
                }
            }
            i++;
        }
    }

    return (
        <div className="center">
            <div className="content">
                <p className="warning">Bij veranderingen zullen alle indieningen opnieuw gecontroleerd worden.</p>
                <div className="type">
                    <div className="field">
                        <input id="switchRoundedDefault" type="checkbox" onChange={e => handleCheckbox(e)} name="switchRoundedDefault" className="switch is-rounded"/>
                        {checked
                        ? <label htmlFor="switchRoundedDefault">
                            <div className="thin">enkele file</div>
                            <div className="divider">/</div>
                            <div className="thick">zip-bestand</div>
                        </label>
                        : <label htmlFor="switchRoundedDefault">
                            <div className="thick">enkele file</div>
                            <div className="divider">/</div>
                            <div className="thin">zip-bestand</div>
                        </label>
                    }
                    </div>
                </div>
                <p className="specify">Specifieer welke files de zip moet bevatten:</p>
                <div className="recursive">
                    {parse(test_structure).map(
                        line => line
                    )}
                </div>
                <label className="checkbox">
                    <input type="checkbox"/>
                    Ook andere files toelaten.
                </label>
            </div>
        </div>
    )
}