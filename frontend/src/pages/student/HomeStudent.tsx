import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ProjectCardStudent from "./ProjectCardStudent.tsx";
import '../../assets/styles/students_components.css'
import DeadlineTable from "./DeadlineTable.tsx";
import {STUDENT_ROUTER_ID, studentLoaderObject} from "../../dataloaders/StudentLoader.ts";
import {useRouteLoaderData} from "react-router-dom";

export default function HomeStudent(): JSX.Element {
    // data contains a list of Project in data.projects (i think)
    const data: studentLoaderObject = useRouteLoaderData(STUDENT_ROUTER_ID) as studentLoaderObject
    console.log(data) // TODO: remove

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Home"} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex"}>
                    <div className={"student-left px-5 py-5 mx-5 my-5 is-flex is-justify-content-space-evenly"}>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                        <ProjectCardStudent/>
                    </div>
                    <div className={"student-right is-flex is-justify-content-center is-align-items-center"}>
                        <DeadlineTable/>
                    </div>
                </div>
            </div>
        </>
    )
}