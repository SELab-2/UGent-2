import {JSX} from "react";
import '../../assets/styles/simple_checks.css'
import { useState, useEffect } from 'react';
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

    enum Type {
        ZIP,
        DIRECTORY,
        FILE
    }

    interface CheckObject {
        id: number,
        parent_id: number | undefined,
        name: string, 
        shown: boolean, 
        spaces: number, 
        last: boolean, 
        type: Type
    }

    const [checkObjects, setCheckObjects] = useState<CheckObject[]>(initialLoad())

    function initialLoad(): CheckObject[] {
        const list = []
        // first main constraint
        if (test_structure.type == "file_constraint") {
            // file-constraint
            list.push({
                id: 0, 
                parent_id: undefined,
                name: test_structure.name, 
                shown: true, 
                spaces: 0, 
                last: true, 
                type: Type.FILE
            })
        } else {    
            // zip-constraint
            list.push({
                id: 0, 
                parent_id: undefined,
                name: test_structure.name, 
                shown: true, 
                spaces: 0, 
                last: true, 
                type: Type.ZIP
            })

            if (test_structure.sub_constraints) {
                parseRecursive(list, 0, 1, test_structure.sub_constraints)
            }
        }
        return list
    }

    // sub constraints
    function parseRecursive(list: CheckObject[], parent_id: number, spaces: number, sub_structures: Constraint[]): number {
        let i = 0;
        let id = parent_id + 1;
        for (let structure of sub_structures) {
            if (i < sub_structures.length - 1) {
                // niet de laatste
                if (structure.type == "directory_constraint") {
                    // een directory
                    list.push({
                        id: id,
                        parent_id: parent_id,
                        name: structure.name, 
                        shown: false, 
                        spaces: spaces, 
                        last: false, 
                        type: Type.DIRECTORY
                    })
                    if (structure.sub_constraints) {
                        id = parseRecursive(list, id, spaces+1, structure.sub_constraints)
                    }
                } else {
                    // een file
                    list.push({
                        id: id, 
                        parent_id: parent_id,
                        name: structure.name, 
                        shown: false, 
                        spaces: spaces, 
                        last: false, 
                        type: Type.FILE
                    })
                }
            } else {
                // wel de laatste
                if (structure.type == "directory_constraint") {
                    // een directory
                    list.push({
                        id: id, 
                        parent_id: parent_id,
                        name: structure.name, 
                        shown: false, 
                        spaces: spaces, 
                        last: true, 
                        type: Type.DIRECTORY
                    })
                    if (structure.sub_constraints) {
                        id = parseRecursive(list, id, spaces+1, structure.sub_constraints)
                    }
                } else {
                    // een file
                    list.push({
                        id: id, 
                        parent_id: parent_id,
                        name: structure.name, 
                        shown: false, 
                        spaces: spaces, 
                        last: true, 
                        type: Type.FILE
                    })
                }
            }
            i++;
            id++;
        }
        return id - 1; // don't count last increase
    }

    function changeVisibility(id: number): undefined {
        let closing = checkObjects.filter(checkObject => checkObject.parent_id === id && !checkObject.shown).length === 0
        if (!closing) {
            let newCheckObjects = []
            for (let checkObject of checkObjects) {
                if (checkObject.parent_id === id) {
                    checkObject.shown = true
                }
                newCheckObjects.push(checkObject)
            }
            setCheckObjects(newCheckObjects)
        } else {
            let ids = [id]
            let newCheckObjects = []
            for (let checkObject of checkObjects) {
                if (checkObject.parent_id !== undefined && ids.includes(checkObject.parent_id)) {
                    checkObject.shown = false
                    ids.push(checkObject.id)
                }
                newCheckObjects.push(checkObject)
            }
            setCheckObjects(newCheckObjects)
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
                    {checkObjects.map(
                        checkObject => 
                        <div> {checkObject.shown &&
                            <div className="line">
                                <div>{"\u00A0".repeat(6 * checkObject.spaces)}</div>
                                <div className="check-object">
                                    <p>{checkObject.id}</p>
                                    {(checkObject.type == Type.ZIP || checkObject.type == Type.DIRECTORY) &&
                                        <button onClick={() => changeVisibility(checkObject.id)}>x</button>}
                                </div>
                            </div>
                        }</div>
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