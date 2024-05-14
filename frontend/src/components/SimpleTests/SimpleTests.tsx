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
    type: string;
    submission: Zip | Constraint;
    constructor(
        type: string,
        submission: Zip | Constraint
    ) {
        this.type = type;
        this.submission = submission;
    }
}

class Zip {
    global_constraints: Constraint[];
    local_constraints: Constraint[];
    self_constraint: Constraint;
    constructor(
        global_constraints: Constraint[],
        local_constraints: Constraint[],
        self_constraint: Constraint
    ) {
        this.global_constraints = global_constraints;
        this.local_constraints = local_constraints;
        this.self_constraint = self_constraint;
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
        parent_id: number | undefined,
        depth: number,
    ) {
        this.type = type;
        this.value = value;
        this.id = id;
        this.parent_id = parent_id;
        this.depth = depth;
    }
}

function json_to_submission(json: any): Submission {

    let json_root_constraint = json['root_constraint'];

    if (json_root_constraint['type'] == 'FILE') {
        return new Submission('FILE', new Constraint(
            'FILE', 
            json_root_constraint['file_name'],
            getID(),
            undefined,
            0
        ))
    }

    /* Local Constraints */

    function dfs(
        json: any, 
        parent_id: number | undefined, 
        depth: number
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
            case 'NOT_PRESENT': { 
                constraint = new Constraint('NOT_PRESENT', json['file_or_directory_name'], id, parent_id, depth);
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

    let json_local_constraints: any[] = json_root_constraint['sub_constraints'];
    let local_constraints = json_local_constraints.map(c => dfs(c, undefined, 1)).reduce((flat, next) => flat.concat(next), []);

    /* Global Constraints */

    function iterate(json_list: any): Constraint[] {

       let constraints: Constraint[] = [];

       for (let json of json_list) {
            let id = getID();

            let constraint!: Constraint;
            switch(json['type']) { 
                case 'NOT_PRESENT': { 
                    constraint = new Constraint('NOT_PRESENT', json['file_or_directory_name'], id, undefined, 0);
                    break; 
                }
                case 'EXTENSION_NOT_PRESENT': { 
                    constraint = new Constraint('EXTENSION_NOT_PRESENT', json['extension'], id, undefined, 0);
                    break; 
                } 
                case 'EXTENSION_ONLY_PRESENT': { 
                    constraint = new Constraint('EXTENSION_ONLY_PRESENT', json['extension'], id, undefined, 0);
                    break; 
                } 
            } 

            constraints.push(constraint);
       }

       return constraints;
    }

    let json_global_constraints = json_root_constraint['global_constraints'];
    let global_constraints = iterate(json_global_constraints);

    let x = new Submission("ZIP", new Zip(
        global_constraints,
        local_constraints,
        new Constraint("ZIP", json_root_constraint['zip_name'], getID(), undefined, 0)
    ));
    console.log(x)
    return x
}

//function submission_to_json(submission: Submission): string {
//
//    function constraint_to_object(constraint: Constraint): object {
//        let obj: any = {
//            "type": constraint.type,
//        }
//
//        switch (constraint.type) {
//            case 'ZIP':
//                obj['zip_name'] = constraint.value;
//                break;
//            case 'FILE':
//                obj['file_name'] = constraint.value;
//                break;
//            case 'DIRECTORY':
//                obj['directory_name'] = constraint.value;
//                break;
//        }
//
//        if (constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') {
//            let sub_constraints = submission.local_constraints.filter(x => x.parent_id === constraint.id);
//            obj.sub_constraints = sub_constraints.map(x => constraint_to_object(x));
//        }
//        
//        return obj;
//    }
//
//    let obj = {
//        "type": "SUBMISSION",
//        "root_constraint": local_constraint()
//    };
//
//    // TODO: wait for more info on the constraints
//}

function get_all_ids(submission: Submission) {

    if (submission.type == 'FILE') {
        return [(submission.submission as Constraint).id];
    }

    let global_ids = (submission.submission as Zip).global_constraints.map(constraint => constraint.id);
    let local_ids = (submission.submission as Zip).local_constraints.map(constraint => constraint.id);
    return global_ids.concat(local_ids).concat([(submission.submission as Zip).self_constraint.id]);
}

export default function SimpleTests(props: { 
    teacherOrStudent: TeacherOrStudent,
    initialData: string,
    setData: Dispatch<SetStateAction<string>> | undefined,
    setHasChanged: Dispatch<SetStateAction<boolean>> | undefined
}): JSX.Element {

    const { t } = useTranslation();

    const [submission, setSubmission]   = useState<Submission>(json_to_submission(JSON.parse(props.initialData)));
    const [isZip,      setIsZip     ]   = useState<boolean>(submission.type === 'ZIP');
    const [isHovering, setIsHovering]   = useState<number | undefined>(undefined);
    const [isExpanded, setIsExpanded]   = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, false])));
    const [isShown,    setIsShown   ]   = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, false])));
    const [isMenuOpen, setIsMenuOpen]   = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, false])));

    useEffect(() => {
        if (submission.type === 'ZIP') {
            let zip = submission.submission as Zip;
            setIsShown(structuredClone(isShown.set(zip.self_constraint.id, true))); /* we laten de root constraint zien */
            setIsHovering(zip.self_constraint.id);
        }
    }, []);

    useEffect(() => {
        //let new_data = submission_to_json(submission);
        //if (props.setData !== undefined) {
        //    props.setData(new_data);
        //}
        //if (props.setHasChanged !== undefined) {
        //    props.setHasChanged(_.isEqual(new_data, props.initialData));
        //}
    }, [submission]);

    /* Functions that change the submission */

    function doChangeRootType(oldSubmission: Submission): Submission {
        if (oldSubmission.type === 'ZIP') {
            setIsZip(false);
            return new Submission('FILE', new Constraint(
                'FILE', 
                "CHANGE_ME",
                getID(),
                undefined,
                0
            ))
        }
        setIsZip(true);
        return new Submission('ZIP', new Zip(
            [],
            [],
            new Constraint("ZIP", "CHANGE_ME.zip", getID(), undefined, 0)
        ))
    }

    function doDeleteConstraint(oldSubmission: Submission, id: number): Submission {
        /* assume ZIP */
        let zip = oldSubmission.submission as Zip;

        // can't delete root

        // check global
        let newGlobalConstraints = zip.global_constraints.filter(constraint => constraint.id !== id);

        // check local
        let newLocalConstraints = [];
        let to_remove: number[] = [];
        for (let constraint of zip.local_constraints) {
            if (constraint.id === id || to_remove.includes(constraint.parent_id as number)) {
                to_remove.push(constraint.id); // remove recursively
            } else {
                newLocalConstraints.push(constraint);
            }
        }

        return new Submission(oldSubmission.type, new Zip(newGlobalConstraints, newLocalConstraints, zip.self_constraint));
    }

    function doChangeConstraintType(oldSubmission: Submission, id: number, type: string): Submission {
        /* assume ZIP */
        let zip = oldSubmission.submission as Zip;

        // can't change root type through this function (see doChangeRootType)

        // check global
        let g = zip.global_constraints.find(constraint => constraint.id === id);
        if (g !== undefined) {
            let newConstraint = new Constraint(type, g.value, g.id, g.parent_id, g.depth);
            let index = zip.global_constraints.findIndex(constraint => constraint.id === newConstraint.id);
            let newGlobalConstraints = [...zip.global_constraints.slice(0, index + 1), newConstraint, ...zip.global_constraints.slice(index + 1)];
            return new Submission(oldSubmission.type, new Zip(newGlobalConstraints, zip.local_constraints, zip.self_constraint));
        }

        // check local
        let l = zip.local_constraints.find(constraint => constraint.id === id);
        let newConstraint = new Constraint(type, l!.value, l!.id, l!.parent_id, l!.depth);
        let index = zip.local_constraints.findIndex(constraint => constraint.id === newConstraint.id);
        let newLocalConstraints = [...zip.local_constraints.slice(0, index), newConstraint, ...zip.local_constraints.slice(index + 1)];
        let newSubmission = new Submission("ZIP", new Zip(zip.global_constraints, newLocalConstraints, zip.self_constraint));
        let to_remove = zip.local_constraints.filter(constraint => constraint.parent_id === id);
        for (let x of to_remove) { // remove children recursively on a change
            newSubmission = doDeleteConstraint(newSubmission, x.id);
        }
        return newSubmission;
    }

    function doNewConstraint(oldSubmission: Submission, id: number | undefined, type: string, newId: number) {
        /* assume ZIP */
        let zip = oldSubmission.submission as Zip;

        // check new constraint for root
        let local_constraints_plus_zip = [zip.self_constraint, ...zip.local_constraints];

        // check global
        if (id === undefined) { // undefined id => new global constraint
            let newGlobalConstraints = zip.global_constraints.concat([new Constraint(type, "CHANGE_ME", newId, id, 0)]);
            return new Submission("ZIP", new Zip(newGlobalConstraints, zip.local_constraints, zip.self_constraint));
        }

        // check local
        let oldConstraint = local_constraints_plus_zip.find(constraint => constraint.id === id);
        let newConstraint = new Constraint(type, "CHANGE_ME", newId, id, oldConstraint!.depth+1);
        let sub_items = zip.local_constraints.filter(constraint => constraint.parent_id === id);
        let index!: number;
        if (sub_items.length === 0) {
            // No sub-items yet. Put directly after item.
            index = zip.local_constraints.findIndex(constraint => constraint.id === id);
            // index can be -1. this means we added to an empty zip root.
            // however, we don't have to do anything else because it will still work as intended in the slice
        } else {
            // Sub-items present. Put after last sub-item.
            index = zip.local_constraints.findIndex(constraint => constraint.id === sub_items[sub_items.length-1].id);
        }
        let new_local_constraints = [...zip.local_constraints.slice(0, index + 1), newConstraint, ...zip.local_constraints.slice(index + 1)];
        return new Submission("zip", new Zip(zip.global_constraints, new_local_constraints, zip.self_constraint));
    }

    function doModifyValue(oldSubmission: Submission, id: number, new_value: string) {
        /* assume ZIP */
        let zip = oldSubmission.submission as Zip;

        // modify value for root
        if (zip.self_constraint.id === id) {
            let s = zip.self_constraint;
            let newConstraint = new Constraint(s.type, new_value, s.id, s.parent_id, s.depth);
            return new Submission("zip", new Zip(zip.global_constraints, zip.local_constraints, newConstraint));
        }

        // global constraints
        let g = zip.global_constraints.find(constraint => constraint.id === id);
        if (g !== undefined) {
            let newConstraint = new Constraint(g.type, new_value, g.id, g.parent_id, g.depth);
            let index = zip.global_constraints.findIndex(constraint => constraint.id === newConstraint.id);
            let newGlobalConstraints = [...zip.global_constraints.slice(0, index + 1), newConstraint, ...zip.global_constraints.slice(index + 1)];
            return new Submission("zip", new Zip(newGlobalConstraints, zip.local_constraints, zip.self_constraint));
        }

        // local constraints
        let l = zip.local_constraints.find(constraint => constraint.id === id);
        let newConstraint = new Constraint(l!.type, new_value, l!.id, l!.parent_id, l!.depth);
        let index = zip.local_constraints.findIndex(constraint => constraint.id === newConstraint.id);
        let newLocalConstraints = [...zip.local_constraints.slice(0, index), newConstraint, ...zip.local_constraints.slice(index + 1)];
        return new Submission("ZIP", new Zip(zip.global_constraints, newLocalConstraints, zip.self_constraint));
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
        /* assume ZIP */

        let newIsExpanded = !isExpanded.get(id);
        setIsExpanded(structuredClone(isExpanded.set(id, newIsExpanded)));

        if (newIsExpanded) {
            // open single layer
            for (let constraint of (submission.submission as Zip).local_constraints) {
                if (constraint.parent_id === id) {
                    setIsShown(structuredClone(isShown.set(constraint.id, true)));
                }
            }
        } else {
            // close recursively all layers
            let ids = [id];
            while(ids.length > 0) {
                let rec_id = ids.pop();
                for (let constraint of (submission.submission as Zip).local_constraints) {
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

            {
                !isZip
                ? <div>
                    {/* FILE ROOT */}

                </div>
                : <div className="type-content">
                    {/* ZIP ROOT */}

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
                            {[(submission.submission as Zip).self_constraint].concat((submission.submission as Zip).local_constraints).map(constraint =>
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
                    </div>
                </div>
            }
        </div>
    )
}
