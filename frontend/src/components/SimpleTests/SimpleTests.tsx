/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, react-hooks/exhaustive-deps */
import {Dispatch, JSX, SetStateAction, useEffect, useMemo, useRef} from "react";
import { useState } from 'react';
import { IoMdMore } from "react-icons/io";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import { TeacherOrStudent } from "./TeacherOrStudentEnum";
import { useTranslation } from 'react-i18next';
import { RiAddBoxLine } from "react-icons/ri";
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

    const json_root_constraint = json['root_constraint'];

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

        const id = getID();

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
            case 'EXTENSION_ONLY_PRESENT': { 
                constraint = new Constraint('EXTENSION_ONLY_PRESENT', json['extension'], id, parent_id, depth);
                break; 
            } 
        } 

        const sub_constraints: Constraint[] = [];
        if (Object.prototype.hasOwnProperty.call(json, 'sub_constraints')) {
            for (const sub_obj of json['sub_constraints']) {
                for (const constraint of dfs(sub_obj, id, depth+1)) {
                    sub_constraints.push(constraint);
                }
            }
        }

        return [constraint].concat(sub_constraints);
    }

    const root_id = getID();

    const json_local_constraints: any[] = json_root_constraint['sub_constraints'];
    const local_constraints = json_local_constraints.map(c => dfs(c, root_id, 1)).reduce((flat, next) => flat.concat(next), []);

    /* Global Constraints */

    function iterate(json_list: any): Constraint[] {

       const constraints: Constraint[] = [];

       for (const json of json_list) {
            const id = getID();

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

    const json_global_constraints = json_root_constraint['global_constraints'];
    const global_constraints = iterate(json_global_constraints);

    const x = new Submission("ZIP", new Zip(
        global_constraints,
        local_constraints,
        new Constraint("ZIP", json_root_constraint['zip_name'], root_id, undefined, 0)
    ));

    return x
}

function submission_to_json(submission: Submission): object {

    function constraint_to_object(constraint: Constraint, local_constraint_list: Constraint[]): object {
        const constraint_object: any = {};
        switch (constraint.type) {
            case 'FILE':
                constraint_object['file_name'] = constraint.value;
                break;
            case 'DIRECTORY':
                constraint_object['directory_name'] = constraint.value;
                constraint_object['sub_constraints'] = 
                    local_constraint_list
                        .filter(c => c.parent_id === constraint.id)
                        .map(c => constraint_to_object(c, local_constraint_list));
                break;
            // case 'ZIP': # can't happen
            case 'NOT_PRESENT':
                constraint_object['file_or_directory_name'] = constraint.value;
                break;
            case 'EXTENSION_NOT_PRESENT':
                constraint_object['extension'] = constraint.value;
                break;
            case 'EXTENSION_ONLY_PRESENT':
                constraint_object['extension'] = constraint.value;
                break;
        }
        constraint_object['type'] = constraint.type;
        return constraint_object;
    }

    const submission_object: any = {};
    submission_object['type'] = "SUBMISSION";

    if (submission.type === 'FILE') {
        submission_object['root_constraint'] = constraint_to_object(submission.submission as Constraint, []);
    }

    if (submission.type === 'ZIP') {
        const zip_object: any = {};
        const zip = submission.submission as Zip;
        zip_object['type'] = "ZIP";
        zip_object['zip_name'] = zip.self_constraint.value;

        // global
        zip_object['global_constraints'] = zip.global_constraints.map(c => constraint_to_object(c, zip.local_constraints));

        // local
        zip_object['sub_constraints'] = zip.local_constraints.filter(c => c.parent_id === zip.self_constraint.id).map(c => constraint_to_object(c, zip.local_constraints));

        submission_object['root_constraint'] = zip_object;
    }

    return submission_object;
}

function get_all_ids(submission: Submission) {

    if (submission.type == 'FILE') {
        return [(submission.submission as Constraint).id];
    }

    const global_ids = (submission.submission as Zip).global_constraints.map(constraint => constraint.id);
    const local_ids = (submission.submission as Zip).local_constraints.map(constraint => constraint.id);
    return global_ids.concat(local_ids).concat([(submission.submission as Zip).self_constraint.id]);
}

export default function SimpleTests(props: { 
    teacherOrStudent: TeacherOrStudent,
    initialData: object,
    setData: Dispatch<SetStateAction<object>> | undefined,
    setHasChanged: Dispatch<SetStateAction<boolean>> | undefined
}): JSX.Element {

    const { t } = useTranslation();

    const init_submission = useMemo(() => (props.initialData), []); // initialize once and directly
    const init_submission_ref = useRef<object>(init_submission); // keep mutable reference across re-renders

    const [submission,      setSubmission     ] = useState<Submission>(json_to_submission(init_submission_ref.current));
    const [isZip,           setIsZip          ] = useState<boolean>(submission.type === 'ZIP');
    const [isHovering,      setIsHovering     ] = useState<number | undefined>(undefined);
    const [isExpanded,      setIsExpanded     ] = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, true])));
    const [isShown,         setIsShown        ] = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, true])));
    const [isMenuOpen,      setIsMenuOpen     ] = useState<Map<number, boolean>>(new Map( get_all_ids(submission).map(id => [id, false])));
    const [isGlobalAddOpen, setIsGlobalAddOpen] = useState<boolean>(false);

    useEffect(() => {
        if (submission.type === 'ZIP') {
            const zip = submission.submission as Zip;
            //setIsShown(structuredClone(isShown.set(zip.self_constraint.id, true))); /* we laten de root constraint zien */
            setIsHovering(zip.self_constraint.id);
        }
    }, []);

    useEffect(() => {
        if (submission !== undefined) {
            const new_data = submission_to_json(submission);
            if (props.setData !== undefined) {
                props.setData(new_data);
            }
            if (props.setHasChanged !== undefined) {
                props.setHasChanged(!_.isEqual(init_submission_ref.current, new_data));
            }
        }
    }, [submission]);

    /* Functions that change the submission */

    function doChangeRootType(oldSubmission: Submission, new_root_id: number): Submission {
        if (oldSubmission.type === 'ZIP') {
            setIsZip(false);
            return new Submission('FILE', new Constraint(
                'FILE', 
                "CHANGE_ME",
                new_root_id,
                undefined,
                0
            ))
        }
        setIsZip(true);
        return new Submission('ZIP', new Zip(
            [],
            [],
            new Constraint("ZIP", "CHANGE_ME.zip", new_root_id, undefined, 0)
        ))
    }

    function doDeleteConstraint(oldSubmission: Submission, id: number): Submission {
        /* assume ZIP */
        const zip = oldSubmission.submission as Zip;

        // can't delete root

        // check global
        const newGlobalConstraints = zip.global_constraints.filter(constraint => constraint.id !== id);

        // check local
        const newLocalConstraints = [];
        const to_remove: number[] = [];
        for (const constraint of zip.local_constraints) {
            if (constraint.id === id || to_remove.includes(constraint.parent_id as number)) {
                to_remove.push(constraint.id); // remove recursively
            } else {
                newLocalConstraints.push(constraint);
            }
        }
        
        const x = new Submission(oldSubmission.type, new Zip(newGlobalConstraints, newLocalConstraints, zip.self_constraint));
        return x
    }

    function doChangeConstraintType(oldSubmission: Submission, id: number, type: string): Submission {
        /* assume ZIP */
        const zip = oldSubmission.submission as Zip;

        // can't change root type through this function (see doChangeRootType)

        // check global
        const g = zip.global_constraints.find(constraint => constraint.id === id);
        if (g !== undefined) {
            const newConstraint = new Constraint(type, g.value, g.id, g.parent_id, g.depth);
            const index = zip.global_constraints.findIndex(constraint => constraint.id === newConstraint.id);
            const newGlobalConstraints = [...zip.global_constraints.slice(0, index + 1), newConstraint, ...zip.global_constraints.slice(index + 1)];
            return new Submission(oldSubmission.type, new Zip(newGlobalConstraints, zip.local_constraints, zip.self_constraint));
        }

        // check local
        const l = zip.local_constraints.find(constraint => constraint.id === id);
        const newConstraint = new Constraint(type, l!.value, l!.id, l!.parent_id, l!.depth);
        const index = zip.local_constraints.findIndex(constraint => constraint.id === newConstraint.id);
        const newLocalConstraints = [...zip.local_constraints.slice(0, index), newConstraint, ...zip.local_constraints.slice(index + 1)];
        let newSubmission = new Submission("ZIP", new Zip(zip.global_constraints, newLocalConstraints, zip.self_constraint));
        const to_remove = zip.local_constraints.filter(constraint => constraint.parent_id === id);
        for (const x of to_remove) { // remove children recursively on a change
            newSubmission = doDeleteConstraint(newSubmission, x.id);
        }
        return newSubmission;
    }

    function doNewConstraint(oldSubmission: Submission, id: number | undefined, type: string, newId: number) {
        /* assume ZIP */
        const zip = oldSubmission.submission as Zip;

        // check new constraint for root
        const local_constraints_plus_zip = [zip.self_constraint, ...zip.local_constraints];

        // check global
        if (id === undefined) { // undefined id => new global constraint
            const newGlobalConstraints = zip.global_constraints.concat([new Constraint(type, "CHANGE_ME", newId, id, 0)]);
            return new Submission("ZIP", new Zip(newGlobalConstraints, zip.local_constraints, zip.self_constraint));
        }

        // check local
        const oldConstraint = local_constraints_plus_zip.find(constraint => constraint.id === id);
        const newConstraint = new Constraint(type, "CHANGE_ME", newId, id, oldConstraint!.depth+1);

        const sub_item_ids = [id]; // get subitems recursively
        const sub_items: Constraint[] = [];
        for (const try_sub_constraint of zip.local_constraints) {
            if (try_sub_constraint.parent_id !== undefined) {
                if (sub_item_ids.includes(try_sub_constraint.parent_id)) {
                    sub_item_ids.push(try_sub_constraint.id);
                    sub_items.push(try_sub_constraint);
                }
            }
        }

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
        const new_local_constraints = [...zip.local_constraints.slice(0, index + 1), newConstraint, ...zip.local_constraints.slice(index + 1)];
        return new Submission("ZIP", new Zip(zip.global_constraints, new_local_constraints, zip.self_constraint));
    }

    function doModifyValue(oldSubmission: Submission, id: number, new_value: string) {
        
        if (submission.type === 'FILE') {
            const file = submission.submission as Constraint;
            return new Submission("FILE", new Constraint('FILE', new_value, file.id, file.parent_id, file.depth));
        }

        const zip = oldSubmission.submission as Zip;

        // modify value for root
        if (zip.self_constraint.id === id) {
            const s = zip.self_constraint;
            const newConstraint = new Constraint(s.type, new_value, s.id, s.parent_id, s.depth);
            return new Submission("ZIP", new Zip(zip.global_constraints, zip.local_constraints, newConstraint));
        }

        // global constraints
        const g = zip.global_constraints.find(constraint => constraint.id === id);
        if (g !== undefined) {
            const newConstraint = new Constraint(g.type, new_value, g.id, g.parent_id, g.depth);
            const index = zip.global_constraints.findIndex(constraint => constraint.id === newConstraint.id);
            const newGlobalConstraints = [...zip.global_constraints.slice(0, index), newConstraint, ...zip.global_constraints.slice(index + 1)];
            return new Submission("ZIP", new Zip(newGlobalConstraints, zip.local_constraints, zip.self_constraint));
        }

        // local constraints
        const l = zip.local_constraints.find(constraint => constraint.id === id);
        const newConstraint = new Constraint(l!.type, new_value, l!.id, l!.parent_id, l!.depth);
        const index = zip.local_constraints.findIndex(constraint => constraint.id === newConstraint.id);
        const newLocalConstraints = [...zip.local_constraints.slice(0, index), newConstraint, ...zip.local_constraints.slice(index + 1)];
        return new Submission("ZIP", new Zip(zip.global_constraints, newLocalConstraints, zip.self_constraint));
    }

    /* Handlers */

    function handleChangeRootType() {
        const new_root_id = getID();
        const oldSubmission = submission;
        setSubmission(doChangeRootType(submission, new_root_id));
        if (oldSubmission.type === 'FILE') { // we change to ZIP
            setIsShown(structuredClone(isShown.set(new_root_id, true)));
        }
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
        const new_id = getID();
        setSubmission(doNewConstraint(submission, id, type, new_id));
        setIsShown(structuredClone(isShown.set(new_id, true)));
        if (submission.type === 'ZIP') {
            const children_ids = (submission.submission as Zip).local_constraints.filter(c => c.parent_id === id).map(c => c.id);
            for (const child_id of children_ids) {
                setIsShown(structuredClone(isShown.set(child_id, true)));
            }
        }
        if (id !== undefined) {
            setIsExpanded(structuredClone(isExpanded.set(id, true)));
        }
        setIsMenuOpen(structuredClone(isMenuOpen.set(new_id, false)));
        setIsGlobalAddOpen(false);
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

        const newIsExpanded = !isExpanded.get(id);
        setIsExpanded(structuredClone(isExpanded.set(id, newIsExpanded)));

        if (newIsExpanded) {
            // open single layer
            for (const constraint of (submission.submission as Zip).local_constraints) {
                if (constraint.parent_id === id) {
                    setIsShown(structuredClone(isShown.set(constraint.id, true)));
                }
            }
        } else {
            // close recursively all layers
            const ids = [id];
            while(ids.length > 0) {
                const rec_id = ids.pop();
                for (const constraint of (submission.submission as Zip).local_constraints) {
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
            {props.teacherOrStudent === TeacherOrStudent.TEACHER &&
                <div className="type">
                            
                    {isZip
                        ?  <div className="thin">{t('submission_files.root_switch.single_file')}</div>
                        :  <div className="thick">{t('submission_files.root_switch.single_file')}</div>
                    }

                    <Warneable 
                        text={t('submission_files.warning_change_root.type_switch')}
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
            }

            {
                !isZip
                ? <div>
                    {/* FILE ROOT */}
                    <div className="file-root-container">
                        <div className="pb-1">{t('submission_files.single_file.name')}</div>
                        <div className="constraint-row">
                            {/* value field */}
                            {props.teacherOrStudent === TeacherOrStudent.TEACHER
                            ? <input 
                                className={"row-value FILE"} 
                                value={(submission.submission as Constraint).value}
                                onChange={e => handleModifyValue((submission.submission as Constraint).id, e.target.value)} 
                            />
                            : <div className="FILE">{(submission.submission as Constraint).value}</div>
                            }
                        </div>
                    </div>
                </div>
                : <div className="type-content">
                    {/* ZIP ROOT */}

                    {/* ...information popup... */}
                    <div className="information-wrapper">
                        <Information 
                            content={
                                <div>
                                    {props.teacherOrStudent === TeacherOrStudent.TEACHER &&
                                        <div>
                                            <div>
                                                {t('submission_files.information.constraints')}
                                            </div>

                                            <br/>

                                            <div>
                                                {t('submission_files.information.global-local')}
                                            </div>

                                            <br/>

                                            <div>
                                                {t('submission_files.information.extensions')}
                                            </div>

                                            <br/>
                                        </div>
                                    }
                                    
                                    <div>{t('submission_files.information.color_codes.title')}</div>
                                    <div className="color-codes bullet-list">
                                        <div className="FILE">{t('submission_files.information.color_codes.file')}</div>
                                        <div className="DIRECTORY">{t('submission_files.information.color_codes.directory')}</div>
                                        <div className="ZIP">{t('submission_files.information.color_codes.zip')}</div>
                                        <div className="info-colorcodes-row">
                                            <div className="NOT_PRESENT">{t('submission_files.information.color_codes.not_present')}</div>
                                            <div>({t('submission_files.menu.info-not_present')})</div>
                                        </div>
                                        <div className="info-colorcodes-row">
                                            <div className="EXTENSION_NOT_PRESENT">{t('submission_files.information.color_codes.extension_not_present')}</div>
                                            <div>({t('submission_files.menu.info-extension_not_present')})</div>
                                        </div>
                                        <div className="info-colorcodes-row">
                                            <div className="EXTENSION_ONLY_PRESENT">{t('submission_files.information.color_codes.extension_only_present')}</div>
                                            <div>({t('submission_files.menu.info-extension_only_present')})</div>
                                        </div>
                                    </div>
                                </div>
                            } 
                            trigger={onClick =>
                                <button onClick={onClick} className="information-button">i</button>
                            }
                        />
                    </div>

                    {/*...global constraints...*/}
                    {
                        (props.teacherOrStudent === TeacherOrStudent.TEACHER || 
                            (props.teacherOrStudent === TeacherOrStudent.STUDENT && 
                                (submission.submission as Zip).global_constraints.length > 0
                            )
                        ) &&
                        <div>
                            <div className="constraint-row">
                                <div>{t('submission_files.constraints.global')}</div>
                                {props.teacherOrStudent === TeacherOrStudent.TEACHER &&
                                    <Popup trigger={
                                        <div className="more-wrapper">
                                            <RiAddBoxLine 
                                                className="row-icon" 
                                            />
                                        </div>
                                    }   position="right center" 
                                        arrow={true} 
                                        onOpen={() => {setIsGlobalAddOpen(true)}}
                                        open={isGlobalAddOpen} 
                                        on="click" 
                                        nested 
                                        contentStyle={{width: 'auto'}}
                                    >
                                        <div>
                                            <button className="menu-not-last-item" onClick={() => handleNewConstraint(undefined, 'NOT_PRESENT')}>{t('submission_files.menu.not_present').match(/'(.*?)'/)?.[1]}</button>
                                            <button className="menu-not-last-item" onClick={() => handleNewConstraint(undefined, 'EXTENSION_NOT_PRESENT')}>{t('submission_files.menu.extension_not_present').match(/'(.*?)'/)?.[1]}</button>
                                            <button onClick={() => handleNewConstraint(undefined, 'EXTENSION_ONLY_PRESENT')}>{t('submission_files.menu.extension_only_present').match(/'(.*?)'/)?.[1]}</button>
                                        </div>
                                    </Popup>
                                }
                            </div>
                            <div className="global-constraints">
                                <div className="constraints-table global-table">
                                    {(submission.submission as Zip).global_constraints.map(constraint =>
                                        <div className="constraint-row" key={''+constraint.id}
                                            onMouseOver={() => handleHoverOver(constraint.id)}
                                            onMouseOut={handleHoverOut}
                                        >
                                    
                                            {/* value field */}
                                            {props.teacherOrStudent === TeacherOrStudent.TEACHER
                                            ? <input 
                                                className={"row-value " + constraint['type']} 
                                                value={constraint.value}
                                                onChange={e => handleModifyValue(constraint.id, e.target.value)} 
                                            />
                                            : <div className={"" + constraint['type']}>{constraint.value}</div>
                                            }
                                                
                                            {/* more button */}
                                            {props.teacherOrStudent === TeacherOrStudent.TEACHER && constraint['type'] !== 'ZIP' &&
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
                                                    <button onClick={() => handleDeleteConstraint(constraint.id)}>{t('submission_files.menu.remove')}</button>
                                                </Popup>
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    }

                    {/*...local constraints...*/}
                    <div>{t('submission_files.constraints.local')}</div>
                    <div className="local-constraints">
                        <div className="constraints-table local-table">
                            {[(submission.submission as Zip).self_constraint].concat((submission.submission as Zip).local_constraints).map(constraint =>
                                isShown.get(constraint.id) &&
                                <div className="constraint-row" key={''+constraint.id}
                                    onMouseOver={() => handleHoverOver(constraint.id)}
                                    onMouseOut={handleHoverOut}
                                >

                                    {/* spacing */}
                                    {"\u00A0".repeat(5 * constraint.depth)}
                            
                                    {/* value field */}
                                    {props.teacherOrStudent === TeacherOrStudent.TEACHER
                                    ? <input 
                                        className={"row-value " + constraint['type']} 
                                        value={constraint.value}
                                        onChange={e => handleModifyValue(constraint.id, e.target.value)} 
                                    />
                                    : <div className={"" + constraint['type']}>{constraint.value}</div>
                                    }

                                    
                                    {/* add file */}
                                    {props.teacherOrStudent === TeacherOrStudent.TEACHER && (constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') &&
                                        <VscNewFile 
                                            className="row-icon" 
                                            style={{visibility: isHovering === constraint.id ? 'visible' : 'hidden' }}
                                            onClick={() => handleNewConstraint(constraint.id, 'FILE')}
                                        />
                                    }

                                    {/* add folder */}
                                    {props.teacherOrStudent === TeacherOrStudent.TEACHER && (constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') &&
                                        <VscNewFolder 
                                            className="row-icon" 
                                            style={{visibility: isHovering === constraint.id ? 'visible' : 'hidden' }}
                                            onClick={() => handleNewConstraint(constraint.id, 'DIRECTORY')}
                                        />
                                    }
                                        
                                    {/* more button */}
                                    {props.teacherOrStudent === TeacherOrStudent.TEACHER && constraint['type'] !== 'ZIP' &&
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
                                                {(() => {
                                                    switch(constraint['type']) {
                                                        case 'FILE':
                                                            return <div>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'DIRECTORY')}>{t('submission_files.menu.directory')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'NOT_PRESENT')}>{t('submission_files.menu.not_present')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_NOT_PRESENT')}>{t('submission_files.menu.extension_not_present')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_ONLY_PRESENT')}>{t('submission_files.menu.extension_only_present')}</button>
                                                            </div>
                                                        case 'DIRECTORY':
                                                            return <div>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'FILE')}>{t('submission_files.menu.file')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'NOT_PRESENT')}>{t('submission_files.menu.not_present')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_NOT_PRESENT')}>{t('submission_files.menu.extension_not_present')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_ONLY_PRESENT')}>{t('submission_files.menu.extension_only_present')}</button>
                                                            </div>
                                                        case 'NOT_PRESENT':
                                                            return <div>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'FILE')}>{t('submission_files.menu.file')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'DIRECTORY')}>{t('submission_files.menu.directory')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_NOT_PRESENT')}>{t('submission_files.menu.extension_not_present')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_ONLY_PRESENT')}>{t('submission_files.menu.extension_only_present')}</button>
                                                            </div>
                                                        case 'EXTENSION_NOT_PRESENT':
                                                            return <div>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'FILE')}>{t('submission_files.menu.file')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'DIRECTORY')}>{t('submission_files.menu.directory')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'NOT_PRESENT')}>{t('submission_files.menu.not_present')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_ONLY_PRESENT')}>{t('submission_files.menu.extension_only_present')}</button>
                                                            </div>
                                                        case 'EXTENSION_ONLY_PRESENT':
                                                            return <div>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'FILE')}>{t('submission_files.menu.file')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'DIRECTORY')}>{t('submission_files.menu.directory')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'NOT_PRESENT')}>{t('submission_files.menu.not_present')}</button>
                                                                <button className="menu-not-last-item" onClick={() => handleChangeConstraintType(constraint.id, 'EXTENSION_NOT_PRESENT')}>{t('submission_files.menu.extension_not_present')}</button>
                                                            </div>
                                                    } })()}
                                                <button onClick={() => handleDeleteConstraint(constraint.id)}>{t('submission_files.menu.remove')}</button>
                                            </div>
                                        </Popup>
                                    }

                                    {/* expand/collaps */}
                                    {(submission.submission as Zip).local_constraints.map(c => c.parent_id).includes(constraint.id) && 
                                     (constraint['type'] === 'ZIP' || constraint['type'] === 'DIRECTORY') && (
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
