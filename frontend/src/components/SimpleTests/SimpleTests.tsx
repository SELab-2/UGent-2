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
import { stringify } from 'flatted';
import 'bulma-switch/dist/css/bulma-switch.min.css'
import { TeacherOrStudent } from "./TeacherOrStudentEnum";
import { useTranslation } from 'react-i18next';


/* === DOCUMENTATION ============================================================================================================================

Roep 'SimpleTests' als component om deze in te laden.
    PROPS: 
        - teacherOrStudent
            TYPE:       TeacherOrStudent
            COMMENT:    "Als TEACHER, dan teacher-view. Als STUDENT, dan student-view."
        - initialData
            TYPE:       object
            COMMENT:    "De initiele indiening-structuur."
        - setHasChanged:        
            TYPE:       React.Dispatch<React.SetStateAction<boolean>> | undefined
            COMMENT:    "Dit is de setter van een react-hook. Deze zal gezet worden naar true/false 
                         afhankelijk van of de indiening-structuur al dan niet aangepast werd."
                        -> undefined als STUDENT
        - setData:
            TYPE:       React.Dispatch<React.SetStateAction<object>>  
            COMMENT:    "De SimpleTests-component zal deze setter telkens oproepen als de indiening-structuur veranderd.
                         Het kan zijn dat de data veranderd wordt naar iets dat het reeds was; 
                         gebruik setHasChanged om een échte verandering te detecteren."
                        -> undefined als STUDENT

!!! WARNING: een not_present_constraint wordt (nog) niet ondersteund. !!!

================================================================================================================================================ */

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

    if (isFolder(FE_cons.type)) {
        return {
            "type": FE_cons.type,
            "name": FE_cons.name,
            "sub_constraints": FE_cons.sub_constraints?.map(sub => FE_2_BE(sub))
        }
    } else {
        return {
            "type": FE_cons.type,
            "name": FE_cons.name
        }
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
        
        const show = (expanded === undefined) ? false : expanded
        
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
                for (const sub of constraint.sub_constraints) {
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

export default function SimpleTests(
    props: {
        teacherOrStudent: TeacherOrStudent, 
        initialData: object,
        setHasChanged: React.Dispatch<React.SetStateAction<boolean>> | undefined,
        setData: React.Dispatch<React.SetStateAction<object>> | undefined
    }
): JSX.Element {

    const { t } = useTranslation();

    const original: BEConstraint = structuredClone(props.initialData) as BEConstraint

    const [data, setData] = useState<FEConstraint>(BE_2_FE(props.initialData as BEConstraint))

    /* Gebruik altijd deze functie om feData aan te passen! */
    function updateData(newData: FEConstraint) {

        if (props.setHasChanged !== undefined && props.setData !== undefined) {
            const newDataBE = FE_2_BE(newData)

            if (stringify(original) !== stringify(newDataBE)) {
                props.setHasChanged(true)
            } else {
                props.setHasChanged(false)
            }

            props.setData(newDataBE)
        }

        setData(newData)
    }

    /* true -> ZIP */
    const [fileOrZip, setFileOrZip] = useState<boolean>(data.type === ZIP);

    const [isHoveringMore, setIsHoveringMore] = useState<Map<number, boolean>>(new Map(
        getAllIds(data).map(id => [id, false])
    ));

    function getAllIds(constraint: FEConstraint): number[] {
        const list = [constraint.id]
        if (constraint.sub_constraints !== undefined) {
            for (const sub of constraint.sub_constraints) {
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

        updateData(expand_sub(structuredClone(data)))
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
                ids.push(constraint.id)
            }

            constraint.sub_constraints = constraint.sub_constraints?.map(e => collaps_sub(e))

            return constraint
        }

        updateData(collaps_sub(structuredClone(data)))
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

        updateData(modify_sub(structuredClone(data)))
        
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
                for (const sub of constraint.sub_constraints) {
                    add(sub)
                }
            }
        }

        add(data)

        // update display
        updateData(structuredClone(data))
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
                for (const sub of constraint.sub_constraints) {
                    remove(sub)
                }
            }

        }

        remove(data)

        // update display
        updateData(structuredClone(data))

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
                for (const sub of constraint.sub_constraints) {
                    switchDIR(sub)
                }
            }
        }

        switchDIR(data)

        // update display
        updateData(structuredClone(data))
    }

    /* Logic for changeing the root type */
    function handleChangeRoot() {

        if (fileOrZip) {
            // previously zip
            updateData({
                "type": FILE, 
                "name": "CHANGE_ME", 
                "sub_constraints": undefined,
                id: getID(),
                parent_id: undefined,
                expanded: undefined,
            })
        } else {
            // previously file
            updateData({
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
        <div className="content-checks">

            {props.teacherOrStudent == TeacherOrStudent.TEACHER
                ? 
                    <>
                        {/* ...warning-text... */}
                        <div className="warning-text">{t('submission_files.changes_text')}</div>

                        {/* ...type-switch... */}
                        <div className="type">
                            <div className="field">
                                <Warneable 
                                    text={t('submission_files.warning.type_switch')}
                                    trigger={ onClick =>
                                        <input 
                                            id="switchOutlinedDefault" 
                                            type="checkbox" 
                                            name="switchOutlinedDefault" 
                                            className="switch is-outlined"
                                            checked={fileOrZip}
                                            onClick={onClick}
                                        /> 
                                    }
                                    proceed={handleChangeRoot}
                                />
                                    
                                {fileOrZip
                                ?   <>
                                        <label htmlFor="switchOutlinedDefault">
                                            <div className="thin">{t('submission_files.root_switch.single_file')}</div>
                                            <div className="divider">/</div>
                                            <div className="thick">{t('submission_files.root_switch.zip_file')}</div>
                                        </label>
                                    </>
                                :   <>
                                        <label htmlFor="switchOutlinedDefault">
                                            <div className="thick">{t('submission_files.root_switch.single_file')}</div>
                                            <div className="divider">/</div>
                                            <div className="thin">{t('submission_files.root_switch.zip_file')}</div>
                                        </label>
                                    </>
                            }
                            </div>
                        </div>
                    </>
                :   <></>
            }

            

            {/* ...color-codes... */}
            <div>{t('submission_files.color_codes.tag')}</div>
            <ul>
                <li className="zip-color">{t('submission_files.color_codes.zip')}</li>
                <li className="locked-dir-color">{t('submission_files.color_codes.folder_refuse_others')}</li>
                <li className="dir-color">{t('submission_files.color_codes.folder_allow_others')}</li>
                <li>{t('submission_files.color_codes.file')}</li>
            </ul>

            {/* ...specify-text... */}
            <div className="specify-text">{props.teacherOrStudent == TeacherOrStudent.TEACHER 
                ? t('submission_files.specify_files.teacher')
                : t('submission_files.specify_files.student')}
            </div>
            
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
                                { ((props.teacherOrStudent == TeacherOrStudent.TEACHER) && (!isZip(v.item.type) && isHoveringMore.get(v.item.id)) )
                                    ?   <Popup trigger={

                                            <div className="more row">
                                                <IoMdMore className="hover-shadow" />
                                            </div>

                                        } position="left center" arrow={true} on="click" nested>

                                            <div className="menu">

                                                {/* ... menu-remove ... */}
                                                <div className="menu-item" id={"x"+v.item.id} key={"y"+v.item.id} >
                                                    <Warneable 
                                                        text={t('submission_files.warning.remove')}
                                                        trigger={onClick => 
                                                            <button onClick={onClick}>{t('submission_files.menu.remove')}</button>
                                                        }
                                                        proceed={() => handleRemove(v.item.parent_id, v.item.id)}
                                                    />
                                                </div>

                                                {/* ... menu-allow-others ... */}
                                                {(v.item.type === LOCKED_DIR || v.item.type === DIR) &&
                                                    <div className="menu-item">
                                                        <label className="checkbox">
                                                            {v.item.type === LOCKED_DIR
                                                                ? <input type="checkbox" onChange={() => handleSwitchDirType(v.item.id)} id={"others"+v.item.id}/>
                                                                : <input type="checkbox" onChange={() => handleSwitchDirType(v.item.id)} id={"others"+v.item.id} checked/>
                                                            }
                                                            {t('submission_files.menu.allow_others')}
                                                        </label>
                                                    </div>
                                                }

                                            </div>

                                        </Popup>
                                    : <IoMdMore className="hidden"/> /* for correct spacing */
                                }

                                {/* ... name ... */}
                                {props.teacherOrStudent == TeacherOrStudent.TEACHER
                                    ? <input 
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
                                    : <div 
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
                                      > {v.item.name} </div>
                                }
                                
                                
                                {/* ... expand ... */}
                                {isFolder(v.item.type)
                                    ? <div>
                                        {v.item.expanded 
                                            ? <MdOutlineExpandLess className="expand hover-encircle" onClick={() => collaps(v.item.id)} />
                                            : <MdOutlineExpandMore className="expand hover-encircle" onClick={() => expand(v.item.id)} />
                                        }
                                        {props.teacherOrStudent == TeacherOrStudent.TEACHER && isHoveringMore.get(v.item.id) && 
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
    )
}
