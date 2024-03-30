import {JSX} from "react";
import '../../assets/styles/simple_checks.css'
import { useState, useEffect } from 'react';
import { IoMdMore } from "react-icons/io";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

const WARNING = "Bij veranderingen zullen alle indieningen opnieuw gecontroleerd worden."
const SINGLE_FILE = "enkele file"
const ZIP_FILE = "zip-bestand"
const SPECIFY = "Specifieer welke files de zip moet bevatten:"
const OTHER_FILES = "Ook andere files toelaten."


/* Enum voor constraint-type ipv string. */
enum ConstraintType {
    ZIP,
    DIRECTORY,
    FILE
}

/* Een constraint zoals binnengekregen van de backend. */
type BEConstraint = {"type": string, "name": string, "sub_constraints"?: BEConstraint[]}

/* Een constraint met eigenschappen bruikbaar voor de frontend. */
interface FEConstraint {
    id: number,
    parent_id: number | undefined,
    name: string, 
    type: ConstraintType,
    shown: boolean, 
    spaces: number,
}

/* We willen constraints kunnen aanmaken. 
Om dit viseel aangenaam te maken, geven we dit object enkele zelfde eigenschappen als FEConstraint.
*/
interface ConstraintAdder {
    parent_id: number | undefined,
    shown: boolean, 
    spaces: number,
}

/* We hebben FEConstraint en ConstraintAdder in één lijst gestopt, maar willen weten wanneer we wat hebben. */
function isFEConstraint(obj: FEConstraint | ConstraintAdder): obj is FEConstraint {
    return (obj as FEConstraint).name !== undefined;
}

/* Dummy data voor een structuur binnengekregen van de backend. 
TODO: Verander dit naar de eigenlijke call later.*/
const dummy_data: BEConstraint = {
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


export default function HomeAdmin(): JSX.Element {
    
    /* Bepaalt of de switch geactiveerd is (true) (zip) or gedeactiveerd (false) (file). */
    const [fileOrZip, setFileOrZip] = useState<Boolean>(false);

    /* Bevat alle constraints (& adders), klaar om te displayen (of aan te passen). */
    /* FIXME: Gebruik setConstraints niet zelf bij inhoudelijke veranderingen! Roep hiervoor ... op! */
    const [constraints, setConstraints] = useState<(FEConstraint | ConstraintAdder)[]>(initialLoad(dummy_data))

    /* Laad de constraints van de backend in. */
    function initialLoad(data: BEConstraint): (FEConstraint | ConstraintAdder)[] {
        
        const start_constraint: FEConstraint = {
            id: 0, 
            parent_id: undefined,
            name: data.name, 
            type: ConstraintType.FILE,
            shown: true, 
            spaces: 0, 
        }

        const list: (FEConstraint | ConstraintAdder)[] = [start_constraint]

        if (data.type == "zip_constraint") {
            (list[0] as FEConstraint).type = ConstraintType.ZIP  
            
            if (data.sub_constraints) {
                initialLoadSub(list, 0, 1, data.sub_constraints)
            }
        }

        return list
    }

    /* Recursive part of initialLoad(). Puts a ConstraintAdder for every non-file container. */
    function initialLoadSub(
        list: (FEConstraint | ConstraintAdder)[], 
        parent_id: number, 
        spaces: number, 
        sub_constraints: BEConstraint[]
    ): number {

        let i = 0;  // the i-th file/directory in this this directory.
        let id = parent_id + 1;

        for (let structure of sub_constraints) {

            // Parse backend constraint to frontend constraints.
            const constraint: FEConstraint = {
                id: id, 
                parent_id: parent_id,
                name: structure.name, 
                type: ConstraintType.FILE,
                shown: false, 
                spaces: spaces, 
            }

            // Add the constraint to the list.
            list.push(constraint)

            // If it is a directory:
            if (structure.type == "directory_constraint") {
                // change type to directory,
                (list[list.length-1] as FEConstraint).type = ConstraintType.DIRECTORY

                // and call initialLoadSub() recursively.
                if (structure.sub_constraints) {
                    id = initialLoadSub(list, id, spaces+1, structure.sub_constraints)
                }

            }

            i++;
            id++;
        }

        // Allows new files/directory to be created in this directory
        const adder: ConstraintAdder = {
            parent_id: parent_id,
            shown: false, 
            spaces: spaces,
        }
        list.push(adder)

        return id - 1; // Don't count last increase.
    }

    /* Logic behind the collaps/expand button. */
    function changeVisibility(id: number): undefined {
        // closing => collaps, !closing => expand
        let closing = constraints.filter(checkObject => checkObject.parent_id === id && !checkObject.shown).length === 0

        
        if (!closing) {

            // EXPAND (single layer deeper)
            
            let newConstraints = []
            for (let object of constraints) {
                if (object.parent_id === id) {
                    object.shown = true
                }
                newConstraints.push(object)
            }
            setConstraints(newConstraints)

        } else {
            
            // COLLAPS (all children layers at once)
            
            let ids = [id]
            let newConstraints = []
            for (let object of constraints) {
                if (object.parent_id !== undefined && ids.includes(object.parent_id)) {
                    object.shown = false
                    if (isFEConstraint(object)) {
                        ids.push(object.id)
                    }
                }
                newConstraints.push(object)
            }
            setConstraints(newConstraints)
        }
    }

    /* Add a CSS tag to give a specific color to a zip or directory. */
    function colorByType(className: string, checkObject: FEConstraint): string {
        if (checkObject.type == ConstraintType.ZIP) {
            return className + " zip";
        } else if (checkObject.type == ConstraintType.DIRECTORY) {
            return className + " folder";
        }
        return className;
    }

    /* Actual rendering HTML */
    return (
        <div className="center">
            <div className="content">

                <p className="warning-text">{WARNING}</p>

                <div className="type">
                    <div className="field">
                        <input id="switchRoundedDefault" type="checkbox" onChange={e => setFileOrZip(e.target.checked)} name="switchRoundedDefault" className="switch is-rounded"/>
                        {fileOrZip
                        ? <label htmlFor="switchRoundedDefault">
                            <div className="thin">{SINGLE_FILE}</div>
                            <div className="divider">/</div>
                            <div className="thick">{ZIP_FILE}</div>
                        </label>
                        : <label htmlFor="switchRoundedDefault">
                            <div className="thick">{SINGLE_FILE}</div>
                            <div className="divider">/</div>
                            <div className="thin">{ZIP_FILE}</div>
                        </label>
                    }
                    </div>
                </div>
                
                <p className="specify-text">{SPECIFY}</p>
                
                {/* All constraints. */}
                <div className="recursive">
                    {constraints.map(
                        checkObject => 

                        /* One constraint/adder => line (if shown) */
                        <div> {checkObject.shown &&
                            <div className="line row">

                                {/* indent as needed */}
                                <div>{"\u00A0".repeat(6 * checkObject.spaces)}</div>

                                {isFEConstraint(checkObject)

                                    /* Constraint */
                                    ? <div className="constraint">

                                        {/* ... three dots ... */}
                                        <IoMdMore className="more hover-shadow" />

                                        {/* ... actual name ... */}
                                        <div className={colorByType("name", checkObject)}>{checkObject.name}</div>
                                        
                                        {/* ... expand/collaps ... */}
                                        {(checkObject.type == ConstraintType.ZIP || checkObject.type == ConstraintType.DIRECTORY) &&
                                            <div className="expand hover-encircle" onClick={() => changeVisibility(checkObject.id)}>
                                                {constraints.filter(o => o.parent_id == checkObject.id && o.shown).length === 0
                                                    ? <MdOutlineExpandLess />
                                                    : <MdOutlineExpandMore />
                                                }
                                            </div>}

                                      </div>
                                    
                                    /* Adder */
                                    : <IoAdd className="adder hover-shadow"/>
                                }
                            </div>
                        }</div>
                    
                    
                    )}
                </div>
                
                <label className="other-files">
                    <input type="checkbox"/>
                    {OTHER_FILES}
                </label>

            </div>
        </div>
    )
}