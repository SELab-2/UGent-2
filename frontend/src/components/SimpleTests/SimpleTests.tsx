import {Dispatch, JSX, SetStateAction, useEffect} from "react";
import { useState, useMemo, useRef } from 'react';
import { IoMdMore } from "react-icons/io";
import { MdExpandLess, MdExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import { stringify } from 'flatted';
import { TeacherOrStudent } from "./TeacherOrStudentEnum";
import { useTranslation } from 'react-i18next';
import { dummy_data } from "./DummyData";
import { IoIosWarning } from "react-icons/io";
import Switch from "react-switch";
import Information from "./Information";
import Popup from 'reactjs-popup';
import Warneable from "./Warneable";
import getID from "./IDProvider";
import 'reactjs-popup/dist/index.css';
import 'bulma-switch/dist/css/bulma-switch.min.css';
import '../../assets/styles/SimpleTests/simple_checks.css';
import _ from 'lodash';

class Submission {
    global_constraints: Constraint[];
    local_constraints: Constraint[];
    
    constructor(
        global_constraints: Constraint[],
        local_constraints: Constraint[]
    ) {
        this.global_constraints = global_constraints;
        this.local_constraints = local_constraints;
    }
}

class Constraint {
    type: string;
    value: string;
    id: number;
    parent_id: number | undefined;
    depth: number;
    constructor(
        type: string,
        value: string,
        id: number,
        parent_id: number | undefined = undefined,
        depth: number = 0,
    ) {
        this.type = type;
        this.value = value;
        this.id = id;
        this.parent_id = parent_id;
        this.depth = depth;
    }
}

function json_to_submission(json: object): Submission {

    let local_constraints: Constraint[] = [];
    let json_root_constraint = json['root_constraint'];

    let global_constraints: Constraint[] = [];
    let json_global_constraints = json['global_constraints'];

    /* Local Constraints */

    function dfs(
        json: any, 
        parent_id: number | undefined = undefined, 
        depth: number = 0
    ): Constraint[] {

        let id = getID();

        let constraint!: Constraint;
        switch(json['type']) { 
            case 'FILE': { 
                constraint = new Constraint('FILE', json['file_name'], id, parent_id, depth);
                break; 
            } 
            case 'DIRECTORY': { 
                constraint = new Constraint('DIRECTORY', json['directory_name'], id, parent_id, depth);
                break; 
            } 
            case 'ZIP': { 
                constraint = new Constraint('ZIP', json['zip_name'], id, parent_id, depth);
                break; 
            }
            case 'EXTENSION_NOT_PRESENT': { 
                constraint = new Constraint('EXTENSION_NOT_PRESENT', json['extension'], id, parent_id, depth);
                break; 
            } 
        } 

        let sub_constraints: Constraint[] = [];
        if (json.hasOwnProperty('sub_constraints')) {
            for (let sub_obj of json['sub_constraints']) {
                for (let constraint of dfs(sub_obj, id, depth+1)) {
                    sub_constraints.push(constraint);
                }
            }
        }

        return [constraint].concat(sub_constraints);
    }

    local_constraints = dfs(json_root_constraint, undefined, 0);

    /* Local Constraints */

    function iterate(json_list: any): Constraint[] {

       let constraints: Constraint[] = [];

       for (let json of json_list) {
            let id = getID();

            let constraint!: Constraint;
            switch(json['type']) { 
                case 'FILE': { 
                    constraint = new Constraint('FILE', json['file_name'], id);
                    break; 
                } 
                case 'DIRECTORY': { 
                    constraint = new Constraint('DIRECTORY', json['directory_name'], id);
                    break; 
                } 
                case 'ZIP': { 
                    constraint = new Constraint('ZIP', json['zip_name'], id);
                    break; 
                }
                case 'EXTENSION_NOT_PRESENT': { 
                    constraint = new Constraint('EXTENSION_NOT_PRESENT', json['extension'], id);
                    break; 
                } 
            } 

            constraints.push(constraint);
       }

       return constraints;
    }

    global_constraints = iterate(json_global_constraints);

    return new Submission(global_constraints, local_constraints);
}

function submission_to_json(submission: Submission): object {

    function constraint_to_object(constraint: Constraint): object {
        let obj: {[key: string]: any} = {
            "type": constraint.type,
        }

        switch (constraint['type']) {
            case 'ZIP':
                obj.zip_name = constraint.value;
                break;
            case 'FILE':
                obj.file_name = constraint.value;
                break;
            case 'DIRECTORY':
                obj.directory_name = constraint.value;
                break;
        }

        if (constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') {
            let sub_constraints = submission.local_constraints.filter(x => x.parent_id === constraint.id);
            obj.sub_constraints = sub_constraints.map(x => local_constraint_to_object(x));
        }
        
        return obj;
    }

    let obj = {
        "type": "SUBMISSION",
        "root_constraint": local_constraint()
    };

    // TODO: wait for more info on the constraints
}

function get_all_ids(submission: Submission) {
    let global_ids = submission.global_constraints.map(constraint => constraint.id);
    let local_ids = submission.local_constraints.map(constraint => constraint.id);
    return global_ids.concat(local_ids);
}

export default function SimpleTests(props: { 
    teacherOrStudent: TeacherOrStudent,
    initialData: object,
    setData: Dispatch<SetStateAction<string>> | undefined,
    setHasChanged: Dispatch<SetStateAction<boolean>> | undefined
}): JSX.Element {

    const { t } = useTranslation();

    const [submission, setSubmission] = useState<Submission>(json_to_submission(props.initialData));
    const [isZip, setIsZip] = useState<boolean>(submission.local_constraints[0]['type'] === 'ZIP');
    const [isHovering, setIsHovering] = useState<number | undefined>(undefined);
    const [isExpanded, setIsExpanded] = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, false])));
    const [isShown, setIsShown] = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, false])));
    const [isMenuOpen, setIsMenuOpen] = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, false])));

    useEffect(() => {
        setIsShown(structuredClone(isShown.set(submission.local_constraints[0].id, true)));
        setIsHovering(submission.local_constraints[0].id);
    }, []);

    useEffect(() => {
        let new_data = submission_to_json_string(submission);
        if (props.setData !== undefined) {
            props.setData(new_data);
        }
        if (props.setHasChanged !== undefined) {
            props.setHasChanged(_.isEqual(new_data, props.initialData));
        }
    }, [submission]);

    /* Functions that change the submission */

    function doChangeRootType(oldSubmission: Submission): Submission {
        let root_constraint = oldSubmission.local_constraints[0];
        if (root_constraint['type'] === 'ZIP') {
            root_constraint['type'] = 'FILE';
            setIsZip(false);
        } else if (root_constraint['type'] === 'FILE') {
            root_constraint['type'] = 'ZIP';
            setIsZip(true);
        }
        return new Submission([], [root_constraint]);
    }

    function doDeleteConstraint(oldSubmission: Submission, id: number): Submission {
        let newGlobalConstraints = oldSubmission.global_constraints.filter(constraint => constraint.id !== id);
        let newLocalConstraints = [];
        let to_remove: number[] = [];
        for (let constraint of oldSubmission.local_constraints) {
            if (constraint.id === id || to_remove.includes(constraint.parent_id as number)) {
                to_remove.push(constraint.id);
            } else {
                newLocalConstraints.push(constraint);
            }
        }
        return new Submission(newGlobalConstraints, newLocalConstraints);
    }

    function doChangeConstraintType(oldSubmission: Submission, id: number, type: string): Submission {
        let g = oldSubmission.global_constraints.find(constraint => constraint.id === id);
        if (g !== undefined) {
            let newConstraint = new Constraint(type, g.value, g.id, g.parent_id, g.depth);
            let index = oldSubmission.global_constraints.findIndex(constraint => constraint.id === newConstraint.id);
            let newGlobalConstraints = [...submission.global_constraints.slice(0, index + 1), newConstraint, ...oldSubmission.global_constraints.slice(index + 1)];
            return new Submission(newGlobalConstraints, oldSubmission.local_constraints);
        }
        let l = oldSubmission.local_constraints.find(constraint => constraint.id === id);
        let newConstraint = new Constraint(type, l!.value, l!.id, l!.parent_id, l!.depth);
        let index = oldSubmission.local_constraints.findIndex(constraint => constraint.id === newConstraint.id);
        let newLocalConstraints = [...submission.local_constraints.slice(0, index), newConstraint, ...oldSubmission.local_constraints.slice(index + 1)];
        let newSubmission = new Submission(oldSubmission.global_constraints, newLocalConstraints);
        let to_remove = oldSubmission.local_constraints.filter(constraint => constraint.parent_id === id);
        for (let x of to_remove) {
            newSubmission = doDeleteConstraint(newSubmission, x.id);
        }
        return newSubmission;
    }

    function doNewConstraint(oldSubmission: Submission, id: number | undefined, type: string, newId: number) {
        if (id === undefined) {
            let newGlobalConstraints = oldSubmission.global_constraints.concat([new Constraint(type, "CHANGE_ME", newId, id)]);
            return new Submission(newGlobalConstraints, oldSubmission.local_constraints);
        }
        let oldConstraint = oldSubmission.local_constraints.find(constraint => constraint.id === id);
        let newConstraint = new Constraint(type, "CHANGE_ME", newId, id, oldConstraint!.depth+1);
        let sub_items = oldSubmission.local_constraints.filter(constraint => constraint.parent_id === id);
        let index!: number;
        if (sub_items.length === 0) {
            // No sub-items yet. Put directly after item.
            index = oldSubmission.local_constraints.findIndex(constraint => constraint.id === id);
        } else {
            // Sub-items present. Put after last sub-item.
            index = oldSubmission.local_constraints.findIndex(constraint => constraint.id === sub_items[sub_items.length-1].id);
        }
        let new_local_constraints = [...oldSubmission.local_constraints.slice(0, index + 1), newConstraint, ...oldSubmission.local_constraints.slice(index + 1)];
        return new Submission(oldSubmission.global_constraints, new_local_constraints);
    }

    function doModifyValue(oldSubmission: Submission, id: number, new_value: string) {
        let g = oldSubmission.global_constraints.find(constraint => constraint.id === id);
        if (g !== undefined) {
            let newConstraint = new Constraint(g.type, new_value, g.id, g.parent_id, g.depth);
            let index = oldSubmission.global_constraints.findIndex(constraint => constraint.id === newConstraint.id);
            let newGlobalConstraints = [...submission.global_constraints.slice(0, index + 1), newConstraint, ...oldSubmission.global_constraints.slice(index + 1)];
            return new Submission(newGlobalConstraints, oldSubmission.local_constraints);
        }
        let l = oldSubmission.local_constraints.find(constraint => constraint.id === id);
        let newConstraint = new Constraint(l!.type, new_value, l!.id, l!.parent_id, l!.depth);
        let index = oldSubmission.local_constraints.findIndex(constraint => constraint.id === newConstraint.id);
        let newLocalConstraints = [...submission.local_constraints.slice(0, index), newConstraint, ...oldSubmission.local_constraints.slice(index + 1)];
        return new Submission(oldSubmission.global_constraints, newLocalConstraints);
    }

    /* Handlers */

    function handleChangeRootType() {
        setSubmission(doChangeRootType(submission));
    }

    function handleDeleteConstraint(id: number) {
        setSubmission(doDeleteConstraint(submission, id));
        isExpanded.delete(id);
        isMenuOpen.delete(id);
        isShown.delete(id);
        setIsExpanded(isExpanded);
        setIsMenuOpen(isMenuOpen);
        setIsShown(isShown);
    }

    function handleChangeConstraintType(id: number, type: string) {
        setSubmission(doChangeConstraintType(submission, id, type));
        setIsMenuOpen(structuredClone(isMenuOpen.set(id, false)));
    }

    function handleNewConstraint(id: number | undefined, type: string,) {
        let new_id = getID();
        setSubmission(doNewConstraint(submission, id, type, new_id));
        setIsShown(structuredClone(isShown.set(new_id, true)));
        setIsExpanded(structuredClone(isShown.set(new_id, true)));
        setIsMenuOpen(structuredClone(isMenuOpen.set(new_id, false)));
    }

    function handleModifyValue(id: number, new_value: string) {
        setSubmission(doModifyValue(submission, id, new_value));
    }

    function handleHoverOver(id: number) {
        setIsHovering(id);
    }

    function handleHoverOut() {
        setIsHovering(undefined);
    }

    function handleClickExpand(id: number) {
        let newIsExpanded = !isExpanded.get(id);
        setIsExpanded(structuredClone(isExpanded.set(id, newIsExpanded)));

        if (newIsExpanded) {
            // open single layer
            for (let constraint of submission.local_constraints) {
                if (constraint.parent_id === id) {
                    setIsShown(structuredClone(isShown.set(constraint.id, true)));
                }
            }
        } else {
            // close recursively all layers
            let ids = [id];
            while(ids.length > 0) {
                let rec_id = ids.pop();
                for (let constraint of submission.local_constraints) {
                    if (constraint.parent_id === rec_id) {
                        setIsExpanded(structuredClone(isExpanded.set(constraint.id, false)));
                        setIsShown(structuredClone(isShown.set(constraint.id, false)));
                        ids.push(constraint.id);
                    }
                }
            }
        }
    }

    function handleOpenMenu(id: number) {
        setIsMenuOpen(structuredClone(isMenuOpen.set(id, true)));
    }

    return (
        <div className="content-checks">

            {/* SUBMISSION TYPE */}
            <div className="type">
                        
                {isZip
                    ?  <div className="thin">{t('submission_files.root_switch.single_file')}</div>
                    :  <div className="thick">{t('submission_files.root_switch.single_file')}</div>
                }

                <Warneable 
                    text={t('submission_files.warning.type_switch')}
                    trigger={ onClick =>
                        <Switch 
                            className="switch" 
                            onChange={onClick} 
                            checked={isZip}
                            handleDiameter={20}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            onColor="#006edc" 
                            offColor="#006edc" 
                            
                        />
                    }
                    proceed={handleChangeRootType}
                />

                {isZip
                    ? <div className="thick">{t('submission_files.root_switch.zip_file')}</div>
                    : <div className="thin">{t('submission_files.root_switch.zip_file')}</div>
                }

            </div>

            {/* ZIP FILE */}
            <div className="type-content">

                {/* ...local constraints tag... */}
                <div className="information-wrapper">
                    <Information 
                        content={
                            <div>
                                <div>
                                    You can edit the name of a contraint by clicking on it.
                                    By hovering over a constraint, more operations will appear.
                                </div>

                                <br/>
                                
                                <div>{t('submission_files.color_codes.tag')}</div>
                                <div className="color-codes">
                                    <li className="zip-color">{t('submission_files.color_codes.zip')}</li>
                                    <li className="locked-dir-color">{t('submission_files.color_codes.folder_refuse_others')}</li>
                                    <li className="dir-color">{t('submission_files.color_codes.folder_allow_others')}</li>
                                    <li>{t('submission_files.color_codes.file')}</li>
                                </div>
                            </div>
                        } 
                        trigger={onClick =>
                            <button onClick={onClick} className="information-button">i</button>
                        }
                    />
                </div>

                {/*...local constraints...*/}
                <div>Local constraints:</div>
                <div className="global-constraints">
                    <div className="constraints-table global-table">
                        {submission.local_constraints.map(constraint =>
                            isShown.get(constraint.id) &&
                            <div className="constraint-row" key={''+constraint.id}
                                onMouseOver={() => handleHoverOver(constraint.id)}
                                onMouseOut={handleHoverOut}
                            >

                                {/* spacing */}
                                {"\u00A0".repeat(5 * constraint.depth)}
                        
                                {/* value field */}
                                <input 
                                    className={"row-value " + constraint['type']} 
                                    value={constraint.value}
                                    onChange={e => handleModifyValue(constraint.id, e.target.value)} 
                                />

                                {/* add file */}
                                {(constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') &&
                                <VscNewFile 
                                    className="row-icon" 
                                    style={{visibility: isHovering === constraint.id ? 'visible' : 'hidden' }}
                                    onClick={() => handleNewConstraint(constraint.id, 'FILE')}
                                />}

                                {/* add folder */}
                                {(constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') &&
                                <VscNewFolder 
                                    className="row-icon" 
                                    style={{visibility: isHovering === constraint.id ? 'visible' : 'hidden' }}
                                    onClick={() => handleNewConstraint(constraint.id, 'DIRECTORY')}
                                />}
                                
                                {/* more button */}
                                {constraint['type'] !== 'ZIP' &&
                                <Popup trigger={
                                    <div className="more-wrapper">
                                        <IoMdMore 
                                            className="row-icon" 
                                            style={{visibility: isHovering === constraint.id ? 'visible' : 'hidden' }}
                                        />
                                    </div>
                                }   position="right center" 
                                    arrow={true} 
                                    onOpen={() => handleOpenMenu(constraint.id)}
                                    open={isMenuOpen.get(constraint.id)} 
                                    on="click" 
                                    nested 
                                    contentStyle={{width: 'auto'}}
                                >
                                    {/* ~ more menu ~ */}
                                    <div>
                                        {constraint['type'] === 'FILE' &&
                                            <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'DIRECTORY')}>make directory</button>
                                        }
                                        {constraint['type'] === 'DIRECTORY' &&
                                            <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'FILE')}>make file</button>
                                        }
                                        <button onClick={() => handleDeleteConstraint(constraint.id)}>remove</button>
                                    </div>
                                </Popup>
                                }

                                {/* expand/collaps */}
                                {(constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') && (
                                    isExpanded.get(constraint.id)
                                        ? <MdExpandLess
                                            className="row-icon" 
                                            style={{visibility: isHovering === constraint.id ? 'visible' : 'hidden' }}
                                            onClick={() => handleClickExpand(constraint.id)}
                                          />
                                        : <MdExpandMore
                                            className="row-icon" 
                                            style={{visibility: isHovering === constraint.id ? 'visible' : 'hidden' }}
                                            onClick={() => handleClickExpand(constraint.id)}
                                          />
                                )}
                                
                            </div>
                        )}
                    </div>
                    <div className="add-global-constraint">

                    </div>
                </div>
                
                
                
                {/*
                <div className="constraints">
                    {flatten(data).map((v) => 
                        <div key={"item"+v.item.id}>
                            {v.show &&
                                <div className="constraint_object row"
                                    onMouseOver={() => setIsHoveringMore(structuredClone(isHoveringMore.set(v.item.id, true)))}
                                    onMouseOut={() => setIsHoveringMore(structuredClone(isHoveringMore.set(v.item.id, false)))}
                                >

                                   
                                    {"\u00A0".repeat(6 * v.spacing)}

                                 
                                    { ((props.teacherOrStudent == TeacherOrStudent.TEACHER) && (!isZip(v.item.type) && isHoveringMore.get(v.item.id)) )
                                        ?   <Popup trigger={

                                                <div className="more row">
                                                    <IoMdMore className="hover-shadow" />
                                                </div>

                                            } position="left center" arrow={true} on="click" nested>

                                                <div className="menu">

                                                   
                                                    <div className="menu-item" id={"x"+v.item.id} key={"y"+v.item.id} >
                                                        <Warneable 
                                                            text={t('submission_files.warning.remove')}
                                                            trigger={onClick => 
                                                                <button onClick={onClick}>{t('submission_files.menu.remove')}</button>
                                                            }
                                                            proceed={() => handleRemove(v.item.parent_id, v.item.id)}
                                                        />
                                                    </div>

                                              
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
                                        : <IoMdMore className="hidden"/> 
                                    }

                                
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
                */}
            </div>
        </div>
    )
}
