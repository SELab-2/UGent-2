import {useState} from "react";
import {ViewProjectTeacherComponent} from "../../components/ViewProjectTeacherComponent.tsx";
import {ProjectTeacher} from "../../types/project.ts";

export function CreateProject() {
    const [projectName, setProjectName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [hours, setHours] = useState(''); //TODO aanpassen naar number
    const [minutes, setMinutes] = useState(''); //TODO aanpassen naar number
    type ValuePiece = Date | null; // nodig voor de deadline
    type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline
    const [deadlineValue, deadlineChange] = useState<Value>(null); // default waarde is null
    const [description, setDescription] = useState('');
    const [requiredFiles, setRequiredFiles] = useState('');
    const [otherFilesAllow, setOtherFilesAllow] = useState(false);
    const [groupProject, setGroupProject] = useState(false);
    const project: ProjectTeacher = {
        projectName: projectName, setProjectName: setProjectName,
        courseName: courseName,
        setCourseName: setCourseName, hours: hours, setHours: setHours,
        minutes: minutes,
        setMinutes: setMinutes,
        deadline: deadlineValue,
        setDeadline: deadlineChange, description: description,
        setDescription: setDescription, requiredFiles: requiredFiles,
        setRequiredFiles: setRequiredFiles,
        otherFilesAllow: otherFilesAllow,
        setOtherFilesAllow: setOtherFilesAllow,
        groupProject: groupProject, setGroupProject: setGroupProject
    }
    return (
        <ViewProjectTeacherComponent project={project}/>
    )
}