import {JSX} from "react";
import {TEACHER_ROUTER_ID, teacherLoaderObject} from "../../dataloaders/TeacherLoader.ts";
import {useRouteLoaderData} from "react-router-dom";
import { Header } from "../../components/Header.tsx";
import { Sidebar } from "../../components/Sidebar.tsx";
import ProjectCardTeacher from "./ProjectCardTeacher.tsx";

export default function HomeTeacher(): JSX.Element {

    const data: teacherLoaderObject = useRouteLoaderData(TEACHER_ROUTER_ID) as teacherLoaderObject;
    console.log(data);

    // TODO: echte data gebruiken

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Home"} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"teacher-main is-flex"}>
                    <div className={"teacher-left px-5 py-5 mx-5 my-5 is-flex is-justify-content-space-evenly"}>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                        <ProjectCardTeacher/>
                    </div>
                </div>
            </div>
        </>
    )
}