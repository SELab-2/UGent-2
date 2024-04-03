import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ViewProjectTeacherComponent} from "../../components/ViewProjectTeacherComponent.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import Statistics from "../../components/Statistics.tsx";

export default function ProjectViewTeacher() {


    const project: ProjectTeacher = {
        projectName: "RSA security",
        courseName: "Information Security",
        hours: 23,
        minutes: 59,
        deadline: new Date('2024-03-23'),
        description: "description of the project",
        requiredFiles: 'Diagram.dgr,verslag.pdf',
        otherFilesAllow: true,
        groupProject: true,
    }


    return (
        <>
            <div className={"main-header"}>
                <Header page_title={project.projectName} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main mt-6"}>
                    <Statistics/>
                    <ViewProjectTeacherComponent project={project}/>
                </div>
            </div>
        </>
    )
}