import {JSX} from "react";
import {ProjectTeacher} from "../../types/project.ts";
import {ViewProjectTeacherComponent} from "../../components/ViewProjectTeacherComponent.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";

export function CreateProject(): JSX.Element {
    const emptyProjectTeacher: ProjectTeacher = {
        courseName: "",
        deadline: new Date(Date.now()),
        description: "",
        groupProject: false,
        hours: 22,
        minutes: 58,
        otherFilesAllow: false,
        projectName: "",
        requiredFiles: "",
    };

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Create project"} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main my-5"}>
                    <ViewProjectTeacherComponent project={emptyProjectTeacher}/>
                </div>
            </div>
        </>
    )
}
