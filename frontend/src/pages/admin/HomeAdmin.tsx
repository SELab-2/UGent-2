import {JSX} from "react";
import '../../assets/styles/simple_checks.css'
import { useState, useEffect } from 'react';
import { SelectionBox } from "../../components/SelectionBox";
import { TbArrowRightBar } from "react-icons/tb";
import { IoMdMore } from "react-icons/io";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { IoRemove } from "react-icons/io5";


export default function HomeAdmin(): JSX.Element {
    
    const [checked, setChecked] = useState<Boolean>(false);

    function handleCheckbox(checkbox: {target: {checked: Boolean}}) {
        setChecked(checkbox.target.checked);
    }

    type BEConstraint = {"type": string, "name": string, "sub_constraints"?: BEConstraint[]}

    const test_structure: BEConstraint = {
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

    interface FEConstraint {
        id: number,
        parent_id: number | undefined,
        name: string, 
        type: ConstraintType,
        shown: boolean, 
        spaces: number,
    }

    enum ConstraintType {
        ZIP,
        DIRECTORY,
        FILE
    }

    interface ConstraintAdder {
        parent_id: number | undefined,
        shown: boolean, 
        spaces: number,
    }

    const [checkObjects, setCheckObjects] = useState<(FEConstraint | ConstraintAdder)[]>(initialLoad())

    function isFEConstraint(obj: FEConstraint | ConstraintAdder): obj is FEConstraint {
        return (obj as FEConstraint).name !== undefined;
    }

    function initialLoad(): (FEConstraint | ConstraintAdder)[] {
        
        const start_constraint: FEConstraint = {
            id: 0, 
            parent_id: undefined,
            name: test_structure.name, 
            type: ConstraintType.FILE,
            shown: true, 
            spaces: 0, 
        }

        const list: (FEConstraint | ConstraintAdder)[] = [start_constraint]

        if (test_structure.type == "zip_constraint") {
            (list[0] as FEConstraint).type = ConstraintType.ZIP  
            
            if (test_structure.sub_constraints) {
                parseSubConstraints(list, 0, 1, test_structure.sub_constraints)
            }
        }

        return list
    }

    function parseSubConstraints(
        list: (FEConstraint | ConstraintAdder)[], 
        parent_id: number, 
        spaces: number, 
        sub_constraints: BEConstraint[]
    ): number {
        let i = 0;
        let id = parent_id + 1;
        for (let structure of sub_constraints) {

            const constraint: FEConstraint = {
                id: id, 
                parent_id: parent_id,
                name: structure.name, 
                type: ConstraintType.FILE,
                shown: false, 
                spaces: spaces, 
            }

            list.push(constraint)

            if (structure.type == "directory_constraint") {
                (list[list.length-1] as FEConstraint).type = ConstraintType.DIRECTORY

                if (structure.sub_constraints) {
                    id = parseSubConstraints(list, id, spaces+1, structure.sub_constraints)
                }

            }
            i++;
            id++;
        }

        const adder: ConstraintAdder = {
            parent_id: parent_id,
            shown: false, 
            spaces: spaces,
        }
        list.push(adder)

        return id - 1; // Don't count last increase.
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
                    if (isFEConstraint(checkObject)) {
                        ids.push(checkObject.id)
                    }
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

                                {isFEConstraint(checkObject)
                                    /* Constraint. */
                                    ? <div className="constraint">

                                        <IoMdMore />

                                        <div className="name">{checkObject.name}</div>
                                        
                                        {(checkObject.type == ConstraintType.ZIP || checkObject.type == ConstraintType.DIRECTORY) &&
                                            <div className="expand" onClick={() => changeVisibility(checkObject.id)}>
                                                {checkObjects.filter(o => o.parent_id == checkObject.id && o.shown).length === 0
                                                    ? <MdOutlineExpandLess />
                                                    : <MdOutlineExpandMore />
                                                }
                                            </div>
                                        }

                                      </div>
                                    
                                    /* Add new constraint. */
                                    : <IoAdd />
                                }
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