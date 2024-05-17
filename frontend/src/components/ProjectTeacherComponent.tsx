import {JSX, useState} from "react";
import Inputfield from "./Inputfield.tsx";
import {SelectionBox} from "./SelectionBox.tsx";
import 'react-calendar/dist/Calendar.css';
import {FaUpload} from "react-icons/fa";
import {ProjectTeacher, Value} from "../types/project.ts";
import "../assets/styles/teacher_components.css"
import SimpleTests from "./SimpleTests/SimpleTests.tsx";
import {TeacherOrStudent} from "./SimpleTests/TeacherOrStudentEnum.tsx";
import Calendar from "react-calendar";
import {useTranslation} from 'react-i18next';

export function ProjectTeacherComponent(props: { project: ProjectTeacher }): JSX.Element {

    const {t} = useTranslation();

    const [projectName, setProjectName] = useState<string>(props.project.projectName)
    const [courseName, setCourseName] = useState<string>(props.project.courseName)
    const [hours, setHours] = useState<number>(props.project.hours);
    const [minutes, setMinutes] = useState<number>(props.project.minutes);
    const [deadline, setDeadline] = useState<Value>(props.project.deadline);
    const [description, setDescription] = useState(props.project.description);
    const [max_students, setMaxStudents] = useState(props.project.maxGroupMembers);
    const [requiredFiles, setRequiredFiles] = useState(props.project.requiredFiles);
    // Deze wordt niet gebruikt. Dit zit verwerkt in het json-object als OnlyPresentConstraint.
    // const [otherFilesAllow, setOtherFilesAllow] = useState(props.project.otherFilesAllow);
    const [groupProject, setGroupProject] = useState(props.project.groupProject);

    // helpers
    const [showCalender, setCalender] = useState(props.project.deadline !== null);
    const [showGroup, setGroup] = useState(props.project.groupProject);

    const expandDeadline = () => {
        setCalender(!showCalender);
    };

    const expandGroup = (checked: boolean) => {
        setGroup(!showGroup);
        setGroupProject(checked);
    };

    const course_options = props.project.all_courses.map(course => course.course_name);

    const hours_array = Array.from({length: 24}, (_, index) => index.toString().padStart(2, '0'));
    const minutes_array = Array.from({length: 60}, (_, index) => index.toString().padStart(2, '0'));

    // SimpleTests
    const [requiredFilesHasChanged, setRequiredFilesHasChanged] = useState(false);

    return (
        <div className={"create-project"}>
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
                <div className="field-body is-flex is-flex-direction-column is-align-items-start is-justify-content-center">
                    <Switch
                        className="pb-3"
                        type="checkbox" 
                        onChange={expandDeadline} 
                        checked={showCalender}
                        onColor="#006edc"
                    />
                    {showCalender &&
                        <div>
                            <div>
                                <Calendar onChange={date => setDeadline(date)} value={deadline}
                                          locale={t('create_project.deadline.locale')}/>
                            </div>
                            <div className="is-horizontal field is-justify-content-center mt-2">
                                <SelectionBox options={hours_array} value={hours.toString()}
                                              setValue={setHours}/>
                                <label className={"title mx-3"}>:</label>
                                <SelectionBox options={minutes_array} value={minutes.toString()}
                                              setValue={setMinutes}/>
                            </div>
                        </div>
                    }
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
                    <label className="file-label">
                        <input className="file-input" type="file" name="resume"/>
                        <span className="file-cta">
                            <span className="file-icon">
                                <FaUpload/>
                            </span>
                            <span className="file-label">
                                {t('create_project.docker_file.choose_button')}
                            </span>
                        </span>
                        <span className="file-name">
                            C:\home\files\docker_file.dockerfile
                        </span>
                    </label>
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
            {/* TEAMWORK FIELD */}
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{t('create_project.teamwork.tag')}</label>
                </div>
                <div className="field-body is-fullwidth is-align-content-center">
                    <label>
                        <input type="checkbox" onChange={e => expandGroup(e.target.checked)}
                               checked={groupProject}/>
                    </label>

                    {showGroup &&
                        <div>
                            <div className="field is-horizontal ml-6">
                                <label
                                    className="label mr-3 is-align-content-center">{t('project.groupmembers.amount_of_members')}</label>
                                <input
                                    style={{width: "30%"}}
                                    className={"input is-rounded"}
                                    type="number"
                                    value={max_students}
                                    onChange={e => setMaxStudents(parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
        ;
}
