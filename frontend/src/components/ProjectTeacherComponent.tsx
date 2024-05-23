import {ChangeEvent, JSX, useEffect, useRef, useState} from "react";
import Inputfield from "./Inputfield.tsx";
import {SelectionBox} from "./SelectionBox.tsx";
import 'react-calendar/dist/Calendar.css';
import {FaEraser, FaUpload} from "react-icons/fa";
import {ProjectTeacher, Value} from "../types/project.ts";
import "../assets/styles/teacher_components.css"
import SimpleTests from "./SimpleTests/SimpleTests.tsx";
import {TeacherOrStudent} from "./SimpleTests/TeacherOrStudentEnum.tsx";
import Calendar from "react-calendar";
import {useTranslation} from 'react-i18next';
import Statistics from "./Statistics.tsx";
import {RegularButton} from "./RegularButton.tsx";
import {FaDownload} from "react-icons/fa6";
import _ from 'lodash';
import {ProjectInput} from "../utils/InputInterfaces.ts";
import {course_create_project} from "../utils/api/Course.ts";
import {Project} from "../utils/ApiInterfaces.ts";
import {useNavigate} from "react-router-dom";
import {project_create_group, update_project} from "../utils/api/Project.ts";
import {getScrollbarWidth} from "../utils/ScrollBarWidth.ts";
import Switch from "react-switch";

export function ProjectTeacherComponent(props: {
    project: ProjectTeacher,
    submission_statistics: { [key: number]: number } | undefined,
    download_all_submissions: (() => Promise<void>) | undefined,
    updateTitle?: (name: string) => void,
    is_new?: boolean,
}): JSX.Element {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [projectName, setProjectName] = useState<string>(props.project.projectName)
    const [courseName, setCourseName] = useState<string>(props.project.courseName)
    const [hours, setHours] = useState<number>(props.project.hours);
    const [minutes, setMinutes] = useState<number>(props.project.minutes);
    const [deadline, setDeadline] = useState<Value>(props.project.deadline);
    const [description, setDescription] = useState(props.project.description);
    const [max_students, setMaxStudents] = useState(props.project.maxGroupMembers);
    const [groups, setGroups] = useState(props.project.amount_groups);
    const [requiredFiles, setRequiredFiles] = useState(props.project.requiredFiles);
    const [visible, setVisible] = useState(props.project.visible)
    const [archived, setArchived] = useState(props.project.archived)
    const [success, isSuccess] = useState<boolean | undefined>(undefined)
    // Deze wordt niet gebruikt. Dit zit verwerkt in het json-object als OnlyPresentConstraint.
    // const [otherFilesAllow, setOtherFilesAllow] = useState(props.project.otherFilesAllow);
    const [groupProject, setGroupProject] = useState(props.project.groupProject);
    const [dockerString, setDockerString] = useState(props.project.dockerFile);
    // helpers
    const [showGroup, setGroup] = useState(props.project.groupProject);
    const [dockerFileName, setDockerFileName] = useState("original_docker_file");

    const [initialValues, setInitialValues] = useState({
        value1: projectName,
        value2: courseName,
        value3: hours,
        value4: minutes,
        value5: deadline,
        value6: description,
        value7: max_students,
        value8: requiredFiles,
        value9: groupProject,
        value10: dockerString,
        value11: visible,
        value12: archived,
        value13: groups
    });

    function allowSaveButton(): boolean {
        const first_part = _.isEqual(projectName, initialValues.value1) &&
            _.isEqual(courseName, initialValues.value2) &&
            _.isEqual(hours, initialValues.value3) &&
            _.isEqual(minutes, initialValues.value4) &&
            _.isEqual(description, initialValues.value6) &&
            _.isEqual(max_students, initialValues.value7) &&
            _.isEqual(requiredFiles, initialValues.value8) &&
            _.isEqual(groupProject, initialValues.value9) &&
            _.isEqual(dockerString, initialValues.value10) &&
            _.isEqual(visible, initialValues.value11) &&
            _.isEqual(archived, initialValues.value12) &&
            _.isEqual(groups, initialValues.value13);
        const second_part_1 = (deadline as Date).toDateString();
        const second_part_2 = (initialValues.value5 as Date).toDateString();
        const second_part = _.isEqual(second_part_1, second_part_2);
        const third_part = groupProject && Number.isNaN(max_students);
        return projectName !== "" && (props.is_new === true || !((first_part && second_part) || third_part));
    }

    const expandGroup = (checked: boolean) => {
        setGroup(!showGroup);
        setGroupProject(checked);
        if (!checked) {
            setMaxStudents(1)
        }
    };

    const course_options = props.project.all_courses.map(course => course.course_name);

    const hours_array = Array.from({length: 24}, (_, index) => index.toString().padStart(2, '0'));
    const minutes_array = Array.from({length: 60}, (_, index) => index.toString().padStart(2, '0'));

    // SimpleTests
    const [requiredFilesHasChanged, setRequiredFilesHasChanged] = useState(false);
    if (requiredFilesHasChanged) {
        if (!requiredFilesHasChanged) {
            console.log("")
        }
    } // eslint prevent error

    // Docker
    const dockerRef = useRef<HTMLInputElement | null>(null);

    function handleChangeDocker(event: ChangeEvent<HTMLInputElement>) {
        if (event.target?.files) {
            // read file
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    const result = event.target.result;
                    if (typeof result === 'string') {
                        setDockerString(result);
                    }
                }
            };
            reader.readAsText(event?.target?.files[0]);
            // set file name
            setDockerFileName(event?.target?.files[0].name);
            // reset selector
            if (dockerRef.current) {
                dockerRef.current.value = '';
            }
        }
    }

    function handleClearNewDocker() {
        // set contents back to original
        setDockerString(initialValues.value10);
        // clear file name
        setDockerFileName("original_docker_file");
        // reset selector
        if (dockerRef.current) {
            dockerRef.current.value = '';
        }
    }

    function handleDownloadDocker() {
        const blob = new Blob([dockerString], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "docker_file";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    async function handleSaveClick() {
        const projectInput: ProjectInput = {
            name: projectName,
            deadline: (deadline as Date).toISOString(),
            visible: visible,
            archived: archived,
            description: description,
            requirements: JSON.stringify(requiredFiles),
            max_students: max_students == 0 ? 1 : max_students,
            dockerfile: dockerString
        }

        const course = props.project.all_courses.find(project => project.course_name == props.project.courseName)
        if (!course) {
            return;
        }

        if (props.project.projectId == -1) {
            // Create new project
            const new_project: Project = await course_create_project(course.course_id, projectInput)
            for (let i = 0; i < groups; i += 1) {
                void project_create_group(new_project.project_id)
            }

            navigate(`/teacher/project/${new_project.project_id}`)
        } else {
            // Update project
            const updated_project: boolean = await update_project(props.project.projectId, projectInput)
            isSuccess(updated_project);
            if (updated_project) {
                setInitialValues({
                    value1: projectName,
                    value2: courseName,
                    value3: hours,
                    value4: minutes,
                    value5: deadline,
                    value6: description,
                    value7: max_students,
                    value8: requiredFiles,
                    value9: groupProject,
                    value10: dockerString,
                    value11: visible,
                    value12: archived,
                    value13: groups
                });
            }
            if (props.updateTitle) {
                props.updateTitle(projectName)
            }
            await new Promise(resolve => setTimeout(resolve, 3000))
            isSuccess(undefined)
        }
    }

    const [width, setWidth] = useState<string>('100%');
    useEffect(() => {
        const scrollbarWidth = getScrollbarWidth();
        setWidth(`calc(100vw - var(--sidebar-width) - ${scrollbarWidth}px)`);
    }, []);

    return (
        <div className={"create-project"}>
            <div className={"create-project-topbar"} style={{width}}>

                <RegularButton placeholder={t('project.save')} add={false} onClick={() => {
                    void handleSaveClick()
                }}
                               disabled={!allowSaveButton()}
                               primary={allowSaveButton()}/>
                <div className={"mr-5"}/>
                {props.submission_statistics !== undefined &&
                    <Statistics statistics={props.submission_statistics}/>
                }
                <div className={"mr-5"}/>
                {props.download_all_submissions !== undefined &&
                    <button className="js-modal-trigger button is-rounded is-pulled-right"
                            onClick={() => {
                                if (props.download_all_submissions !== undefined) {
                                    void props.download_all_submissions()
                                }
                            }}>
                        <span className="icon is-small">
                            <FaDownload/>
                        </span>
                        <span>{t('download.download_all')}</span>
                    </button>
                }
            </div>
            <div className={"create-project-content"}>
                {/* Result Save */}
                {success && <div className="notification is-success is-flex is-justify-content-center mx-5 my-3">
                    {t('create_project.success')}
                </div>}

                {success !== undefined && !success &&
                    <div className="notification is-danger is-flex is-justify-content-center mx-5 my-3">
                        {t('create_project.failed')}
                    </div>}
                {/* PROJECT NAME FIELD */}
                <div className={"field is-horizontal"}>
                    <div className={"field-label"}>
                        <label className="label">{t('create_project.name.tag')}</label>
                    </div>
                    <div className="field-body field">
                        <Inputfield placeholder={t('create_project.name.placeholder')} value={projectName}
                                    setValue={setProjectName}/>
                    </div>
                </div>
                {/* COURSE NAME FIELD */}
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.course.tag')}</label>
                    </div>
                    <div className="field-body field">
                        <SelectionBox options={course_options} value={courseName}
                                      setValue={setCourseName}/>
                    </div>
                </div>
                {/* DEADLINE FIELD */}
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.deadline.tag')}</label>
                    </div>
                    <div
                        className="field-body is-flex is-flex-direction-column is-align-items-start is-justify-content-center">
                        <div>
                            <div>
                                <Calendar onChange={date => setDeadline(date)} value={deadline}
                                          locale={t('create_project.deadline.locale')}/>
                            </div>
                            <div className="is-horizontal field is-justify-content-center mt-2">
                                <SelectionBox options={hours_array} value={hours.toString()}
                                              setValue={setHours} value_as_number={true}/>
                                <label className={"title mx-3"}>:</label>
                                <SelectionBox options={minutes_array} value={minutes.toString()}
                                              setValue={setMinutes} value_as_number={true}/>
                            </div>
                        </div>
                    </div>
                </div>
                {/* DESCRIPTION FIELD */}
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.description.tag')}</label>
                    </div>
                    <div className="field-body field">
                        <div style={{width: "33%"}}> {/* Deze moet er blijven, anders doet css raar*/}
                            <textarea className="textarea" placeholder={t('create_project.description.placeholder')}
                                      value={description}
                                      onChange={e => setDescription(e.target.value)}/>
                        </div>
                    </div>
                </div>
                {/* DOCKER FIELD */}
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.docker_file.tag')}</label>
                    </div>
                    <div className="field-body field file has-name">
                        <div className="docker-wrapper">

                            <div className="docker-row is-flex">
                                <div className="docker-file-present-tag">{t('docker.file-present')}</div>
                                {dockerString === ""
                                    ? <div className="docker-file-present-false">{t('docker.false')}</div>
                                    : <div className="docker-file-present-true">{t('docker.true')}</div>
                                }
                                {dockerString !== "" &&
                                    <button className="download-button button is-small is-light"
                                            onClick={handleDownloadDocker}>
                                        <span className="icon is-small">
                                            <FaDownload/>
                                        </span>
                                    </button>
                                }
                            </div>

                            <div className="is-flex is-align-items-center">
                                <label className="file-label">
                                    <input className="file-input" type="file" name="resume"
                                           ref={dockerRef}
                                           onChange={handleChangeDocker}/>
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <FaUpload/>
                                        </span>
                                        <span className="file-label">
                                            {t('create_project.docker_file.choose_button')}
                                        </span>
                                    </span>

                                    {dockerString !== "" &&
                                        <span className="file-name docker-new-file">
                                            {dockerFileName}
                                        </span>
                                    }
                                </label>
                                {dockerString !== "" &&
                                    <span>
                                    <button className="download-button button is-small is-light"
                                            onClick={handleClearNewDocker}>
                                        <FaEraser/>
                                    </button>
                                </span>
                                }
                            </div>

                        </div>
                    </div>
                </div>
                {/* SUBMISSION FIELD */}
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.submission_files.tag')}</label>
                    </div>
                    <div className="field-body field">
                        <div className="field"> {/* Deze moet er blijven, anders doet css raar*/}
                            <SimpleTests
                                teacherOrStudent={TeacherOrStudent.TEACHER}
                                initialData={requiredFiles}
                                setData={setRequiredFiles}
                                setHasChanged={setRequiredFilesHasChanged}
                            />
                        </div>
                    </div>
                </div>

                {/* VISIBLE FIELD*/}
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.visible')}</label>
                    </div>
                    <div className="field-body is-fullwidth is-align-content-center">
                        <Switch
                            type="checkbox"
                            onColor="#006edc"
                            checked={visible}
                            onChange={e => setVisible(e)}
                        />
                    </div>
                </div>

                {/* Archived FIELD*/}
                {props.project.projectId !== -1 && <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.archived')}</label>
                    </div>
                    <div className="field-body is-fullwidth is-align-content-center">
                        <Switch
                            type="checkbox"
                            onColor="#006edc"
                            checked={archived}
                            onChange={e => setArchived(e)}
                        />
                    </div>
                </div>}

                {props.project.projectId === -1 && <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">{t('create_project.teamwork.tag')}</label>
                    </div>

                    <div className="field-body is-fullwidth is-align-content-center teamwork">
                        <Switch
                            type="checkbox"
                            onColor="#006edc"
                            checked={groupProject}
                            onChange={e => expandGroup(e)}
                        />
                        {showGroup && <>
                            <div className="field is-horizontal">
                                <label
                                    className="mr-3 is-align-content-center">{t('project.groupmembers.amount_of_members')}</label>
                                <input
                                    style={{width: "75px"}}
                                    className={"input is-rounded"}
                                    type="number"
                                    value={max_students}
                                    onChange={e => {
                                        const newValue = parseInt(e.target.value)
                                        if (newValue > 0) {
                                            setMaxStudents(newValue)
                                        }
                                    }}
                                />
                            </div>

                            <div className="field is-horizontal">
                                <label
                                    className="mr-3 is-align-content-center">{t('create_project.amount_of_groups')}
                                </label>
                                <input
                                    style={{width: "75px"}}
                                    className={"input is-rounded"}
                                    type="number"
                                    value={groups}
                                    onChange={e => {
                                        const newValue = parseInt(e.target.value)
                                        if (newValue > 0) {
                                            setGroups(newValue)
                                        }
                                    }}
                                />
                            </div>
                        </>}

                        {!showGroup && <>
                            <div className="field is-horizontal">
                                <label
                                    className="mr-3 is-align-content-center">{t('create_project.amount_of_students')}</label>
                                <input
                                    style={{width: "75px"}}
                                    className={"input is-rounded"}
                                    type="number"
                                    value={groups}
                                    onChange={e => {
                                        const newValue = parseInt(e.target.value)
                                        if (newValue > 0) {
                                            setGroups(newValue)
                                        }
                                    }}
                                />
                            </div>
                        </>}
                    </div>
                </div>}

                {props.project.projectId !== -1 && <div className="field is-horizontal">
                    {showGroup
                        ? <div className="field-label">
                            <label className="label">{t('create_project.amount_of_groups')}</label>
                            <label className="label">{t('project.groupmembers.amount_of_members')}</label>
                        </div>
                        : <div className="field-label">
                            <label className="label">{t('create_project.amount_of_students')}</label>
                        </div>}

                    <div className="field-body is-fullwidth is-align-content-center">
                        {showGroup
                            ? <div className="field-label">
                                <label className="label">{groups}</label>
                                <label className="label">{max_students}</label>
                            </div>
                            : <div className="field-label">
                                <label className="label">{groups}</label>
                            </div>}

                    </div>
                </div>}

            </div>
        </div>
    )
        ;
}
