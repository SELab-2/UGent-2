import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {useState} from "react";
import {ViewProjectTeacherComponent} from "../../components/ViewProjectTeacherComponent.tsx";
import {Project} from "../../types/project.ts";

export default function ProjecctViewTeacher() {
    const [projectName, setProjectName] = useState<string>("Markov Decision Diagram")
    const [courseName, setCourseName] = useState<string>("Automaten, berekenbaarheid en complexiteit")
    const [hours, setHours] = useState('23'); //TODO aanpassen naar number
    const [minutes, setMinutes] = useState('59'); //TODO aanpassen naar number
    type ValuePiece = Date | null; // nodig voor de deadline
    type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline
    const [deadlineValue, deadlineChange] = useState<Value>(new Date('2024-03-23'));
    const [description, setDescription] = useState('"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel arcu sit amet quam scelerisque vestibulum. Nulla lectus ipsum, convallis ut odio sit amet, auctor dictum felis. Phasellus libero sapien, tempus eu fringilla eu, facilisis vel purus. Quisque odio elit, viverra id tortor eu, blandit luctus turpis. Vestibulum libero felis, condimentum finibus posuere sed, lobortis non tellus. Phasellus laoreet, metus a semper vulputate, mi dui lobortis augue, quis fringilla ipsum felis eu mauris. Donec sem dolor, porta ultrices venenatis eget, ullamcorper id turpis. Nulla quis lacinia sapien. Mauris dignissim nisi id quam vulputate molestie. Fusce eleifend sagittis dolor sit amet aliquam. Aenean in sapien diam. Donec iaculis nunc eu enim pulvinar ultricies. Suspendisse potenti. Etiam quis viverra nunc. Nulla tempus in erat vitae tincidunt. Vestibulum et iaculis nulla.');
    const [requiredFiles, setRequiredFiles] = useState('Diagram.dgr,verslag.pdf');
    const [otherFilesAllow, setOtherFilesAllow] = useState(true);
    const [groupProject, setGroupProject] = useState(true);
    const project: Project = {
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
        <>
            <div className={"main-header"}>
                <Header page_title={projectName}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main mt-6 mr-6"}>

                    <ViewProjectTeacherComponent project={project}/>

                </div>
            </div>
        </>
    )
}