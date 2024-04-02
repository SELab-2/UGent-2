import {JSX} from "react";
import '../../assets/styles/SimpleTests/simple_checks.css'
import { useState } from 'react';
import { IoMdMore } from "react-icons/io";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import getID from "./IDProvider";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Warneable from "./Warneable";

/* text literals */
const WARNING = "Bij veranderingen zullen alle indieningen opnieuw gecontroleerd worden."
const SINGLE_FILE = "enkele file"
const ZIP_FILE = "zip-bestand"
const SPECIFY = "Specifieer welke files de zip moet bevatten:" 
const COLOR_CODES = [
    "zip", 
    "folder (enkel gespecifieerde files)",
    "folder (ook andere files toegestaan)",
    "file",
]

/* Definieer constraint-types. */
const ZIP = "zip_constraint"
const FILE = "file_constraint"
const DIR = "directory_constraint"
const LOCKED_DIR = "only_present_directory_constraint"
function isFolder(type: string) {
    return type === DIR || type === LOCKED_DIR || type === ZIP
}
function isZip(type: string) {
    return type === ZIP
}

type BEConstraint = {
    "type": string, 
    "name": string, 
    "sub_constraints"?: BEConstraint[]
}

type FEConstraint = {
    "type": string, 
    "name": string, 
    "sub_constraints"?: FEConstraint[],
    id: number,
    parent_id: number | undefined,
    expanded?: boolean,
}

/* Dummy data voor een structuur binnengekregen van de backend. 
WARNING: not_present_constraint not supported*/
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
                    "type": "only_present_directory_constraint",
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
        }
    ]
}

function BE_2_FE(BE_cons: BEConstraint): FEConstraint {

    function BE_2_FE_sub(BE_cons: BEConstraint, parent_id: number | undefined): FEConstraint {
        
        const this_id = getID()
        
        return {
            "type": BE_cons.type, 
            "name": BE_cons.name, 
            "sub_constraints": BE_cons.sub_constraints?.map(e => BE_2_FE_sub(e, this_id)), 
            id: this_id,
            parent_id: parent_id,
            expanded: (BE_cons.type === FILE) ? undefined : false,
        }
    }
    return BE_2_FE_sub(BE_cons, undefined)
}

function FE_2_BE(FE_cons: FEConstraint): BEConstraint {
    return {
        "type": FE_cons.type,
        "name": FE_cons.type,
        "sub_constraints": FE_cons.sub_constraints?.map(sub => FE_2_BE(sub))
    }
}

/* Input fields will always lose focus on a recursive defined component.
The easiest way to solve this is to flatten the structure and use the .map() function. */
type FlattedConstraint = {
    item: FEConstraint,
    spacing: number,
    show: boolean,
}

function flatten(constraint: FEConstraint): FlattedConstraint[] {

    
    return [{item: constraint, spacing: 0, show: true}].concat(
        flatten_sub(constraint, 0, constraint.expanded).slice(1,)
    )
    

    function flatten_sub(
        constraint: FEConstraint, 
        spacing: number, 
        expanded: boolean | undefined
    ): FlattedConstraint[] {
        
        let show = (expanded === undefined) ? false : expanded
        
        if (!isFolder(constraint.type)) {
            return [{
                item: constraint, 
                spacing: spacing, 
                show: show
            }]
        } else {
            let list = [{
                item: constraint, 
                spacing: spacing, 
                show: show
            }]
            if (constraint.sub_constraints !== undefined) {
                for (let sub of constraint.sub_constraints) {
                    list = list.concat(flatten_sub(
                        sub, 
                        spacing+1, 
                        constraint.
                        expanded, 
                    ))
                }
            }
            return list
        }
    }
}

export default function HomeAdmin(): JSX.Element {

    const [data, setData] = useState<FEConstraint>(BE_2_FE(dummy_data))

    /* true -> ZIP */
    const [fileOrZip, setFileOrZip] = useState<boolean>(data.type === ZIP);

    const [isHoveringMore, setIsHoveringMore] = useState<Map<number, boolean>>(new Map(
        getAllIds(data).map(id => [id, false])
    ));

    function getAllIds(constraint: FEConstraint): number[] {
        let list = [constraint.id]
        if (constraint.sub_constraints !== undefined) {
            for (let sub of constraint.sub_constraints) {
                list.concat(getAllIds(sub))
            }
        }
        return list
    }

    /* expand one layer */
    function expand(id: number) {

        function expand_sub(constraint: FEConstraint): FEConstraint {
            if (constraint.id === id) {
                constraint.expanded = true
            }

            constraint.sub_constraints = constraint.sub_constraints?.map(e => expand_sub(e))

            return constraint
        }

        setData(expand_sub(structuredClone(data)))
    }

    /* collaps all children layers recursively */
    function collaps(id: number) {

        const ids = [id]

        function collaps_sub(constraint: FEConstraint): FEConstraint {
            if (ids.includes(constraint.id)) {
                constraint.expanded = false
            }
            if (constraint.parent_id !== undefined && ids.includes(constraint.parent_id)) {
                constraint.expanded = false
                ids.push(constraint.parent_id)
            }

            constraint.sub_constraints = constraint.sub_constraints?.map(e => collaps_sub(e))

            return constraint
        }

        setData(collaps_sub(structuredClone(data)))
    }

    /* modify the name of a file/folder */
    function modifyName(id: number, value: string) {
        function modify_sub(constraint: FEConstraint): FEConstraint {
            if (constraint.id === id) {
                constraint.name = value
            }

            constraint.sub_constraints = constraint.sub_constraints?.map(e => modify_sub(e))

            return constraint
        }

        setData(modify_sub(structuredClone(data)))
        
    }

    /* add a new constraint */
    function handleAdd(folder_id: number, type: string) {
        function add(constraint: FEConstraint) {
            if (constraint.id === folder_id) {
                // add new file
                constraint.sub_constraints?.push({
                    "type": type, 
                    "name": "CHANGE_ME",
                    "sub_constraints": (!isFolder(type)) ? undefined : [],
                    id: getID(),
                    parent_id: folder_id,
                    expanded: undefined,
                })
                // expand if not yet expanded
                constraint.expanded = true
            }
            if (constraint.sub_constraints) {
                for (let sub of constraint.sub_constraints) {
                    add(sub)
                }
            }
        }

        add(data)

        // update display
        setData(structuredClone(data))
    }

    /* remove a constraint and all its subconstraints recursively */
    function handleRemove(parent_id: number | undefined, id: number) {

        function remove(constraint: FEConstraint) {

            if (constraint.id === parent_id) { 
                if (constraint.sub_constraints !== undefined) {
                    constraint.sub_constraints = constraint.sub_constraints.filter(
                        sub => sub.id !== id
                    )
                }
            }

            if (constraint.sub_constraints) {
                for (let sub of constraint.sub_constraints) {
                    remove(sub)
                }
            }

        }

        remove(data)

        // update display
        setData(structuredClone(data))

    }

    /* LOCKED_DIR -> DIR | DIR -> LOCKED_DIR */
    function handleSwitchDirType(id: number) {
        function switchDIR(constraint: FEConstraint) {
            if (constraint.id === id) {
                if (constraint.type === DIR) {
                    constraint.type = LOCKED_DIR
                } else if (constraint.type === LOCKED_DIR) {
                    constraint.type = DIR
                }
            }
            if (constraint.sub_constraints) {
                for (let sub of constraint.sub_constraints) {
                    switchDIR(sub)
                }
            }
        }

        switchDIR(data)

        // update display
        setData(structuredClone(data))
    }

    /* Logic for changeing the root type */
    function handleChangeRoot() {

        if (fileOrZip) {
            // previously zip
            setData({
                "type": FILE, 
                "name": "CHANGE_ME", 
                "sub_constraints": undefined,
                id: getID(),
                parent_id: undefined,
                expanded: undefined,
            })
        } else {
            // previously file
            setData({
                "type": ZIP, 
                "name": "CHANGE_ME.zip", 
                "sub_constraints": [],
                id: getID(),
                parent_id: undefined,
                expanded: false,
            })
        }

        setFileOrZip(!fileOrZip)
    }

    return (
        <div className="center">
            <div className="content">

                {/* ...warning-text... */}
                <div className="warning-text">{WARNING}</div>

                {/* ...type-switch... */}
                <div className="type">
                    <div className="field">
                        <Warneable 
                            text="All current file specifications will be removed. Are you sure you want to change the root type?"
                            trigger={ onClick =>
                                <input 
                                    id="switchRoundedDefault" 
                                    type="checkbox" 
                                    name="switchRoundedDefault" 
                                    className="switch is-rounded"
                                    checked={fileOrZip}
                                    onClick={onClick}
                                /> 
                            }
                            proceed={handleChangeRoot}
                        />
                         
                        {fileOrZip
                        ?   <>
                                <label htmlFor="switchRoundedDefault">
                                    <div className="thin">{SINGLE_FILE}</div>
                                    <div className="divider">/</div>
                                    <div className="thick">{ZIP_FILE}</div>
                                </label>
                            </>
                        :   <>
                                <label htmlFor="switchRoundedDefault">
                                    <div className="thick">{SINGLE_FILE}</div>
                                    <div className="divider">/</div>
                                    <div className="thin">{ZIP_FILE}</div>
                                </label>
                            </>
                    }
                    </div>
                </div>

                {/* ...color-codes... */}
                <div>Color codes:</div>
                <ul>
                    <li className="zip-color">{COLOR_CODES[0]}</li>
                    <li className="locked-dir-color">{COLOR_CODES[1]}</li>
                    <li className="dir-color">{COLOR_CODES[2]}</li>
                    <li>{COLOR_CODES[3]}</li>
                </ul>

                {/* ...specify-text... */}
                <div className="specify-text">{SPECIFY}</div>
                
                {/* ...constraints... */}
                <div className="constraints">
                    {flatten(data).map((v) => 
                        <div key={"item"+v.item.id}>
                            {v.show &&
                                <div className="constraint_object row"
                                    onMouseOver={() => setIsHoveringMore(structuredClone(isHoveringMore.set(v.item.id, true)))}
                                    onMouseOut={() => setIsHoveringMore(structuredClone(isHoveringMore.set(v.item.id, false)))}
                                >

                                    {/* ... spacing ... */}
                                    {"\u00A0".repeat(6 * v.spacing)}

                                    {/* ... three dots ... */}
                                    { (!isZip(v.item.type) && isHoveringMore.get(v.item.id) )
                                        ?   <Popup trigger={

                                                <div className="more row">
                                                    {/* FIXME:  warneable.proceed works */}
                                                    <IoMdMore className="hover-shadow" />
                                                </div>

                                            } position="left center" arrow={true} on="click">

                                                {/* FIXME:  warneable.proceed doesn't work */}

                                                <div className="menu">

                                                    {/* ... menu-remove ... */}
                                                    <div className="menu-item" id={"x"+v.item.id} key={"y"+v.item.id} >
                                                        <button onClick={() => handleRemove(v.item.parent_id, v.item.id)}>remove</button>
                                                        <Warneable 
                                                            text="Are you sure?" 
                                                            trigger={onClick => 
                                                                <button onClick={onClick}>remove</button>
                                                            }
                                                            proceed={() => handleRemove(v.item.parent_id, v.item.id)} /* FIXME: proceed doesn't fire here for some reason */
                                                        />
                                                    </div>

                                                    {/* ... menu-allow-others ... */}
                                                    {(v.item.type === LOCKED_DIR || v.item.type === DIR) &&
                                                        <div className="menu-item">
                                                            <label className="checkbox"> { /* FIXME: sometimes a border appear around the checkbox -> bulma thing? */}
                                                                {v.item.type === LOCKED_DIR
                                                                    ? <input type="checkbox" onChange={() => handleSwitchDirType(v.item.id)} id={"others"+v.item.id}/>
                                                                    : <input type="checkbox" onChange={() => handleSwitchDirType(v.item.id)} id={"others"+v.item.id} checked/>
                                                                }
                                                                Andere toestaan
                                                            </label>
                                                        </div>
                                                    }

                                                </div>

                                            </Popup>
                                        : <IoMdMore className="hidden"/> /* for correct spacing */
                                    }

                                    {/* ... name ... */}
                                    <input 
                                        className= {"name input is-static " + (
                                            (isFolder(v.item.type)) 
                                            ? isZip(v.item.type)
                                                ? "zip-color"
                                                : v.item.type === LOCKED_DIR
                                                    ? "locked-dir-color"
                                                    : "dir-color"
                                            : ""
                                        )}
                                        id={"name"+v.item.id}
                                        type="text" 
                                        value={v.item.name} 
                                        onChange={e => modifyName(v.item.id, e.target.value)} 
                                    />
                                    
                                    {/* ... expand ... */}
                                    {isFolder(v.item.type)
                                        ? <div>
                                            {v.item.expanded 
                                                ? <MdOutlineExpandLess className="expand hover-encircle" onClick={() => collaps(v.item.id)} />
                                                : <MdOutlineExpandMore className="expand hover-encircle" onClick={() => expand(v.item.id)} />
                                            }
                                            {isHoveringMore.get(v.item.id) && 
                                                <>
                                                    <VscNewFile className="add hover-shadow" onClick={() => handleAdd(v.item.id, FILE)}/>
                                                    <VscNewFolder className="add hover-shadow" onClick={() => handleAdd(v.item.id, LOCKED_DIR)}/>
                                                </>
                                            }
                                        </div>
                                        : <div/>
                                    }

                                </div>
                            }
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}