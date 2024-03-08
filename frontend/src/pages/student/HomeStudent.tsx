import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ProjectCardStudent from "./ProjectCardStudent.tsx";
import '../../assets/styles/students_components.css'

export default function HomeStudent(): JSX.Element {
    return (
        <>
            <div className={"main-header"}>
                <Header/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main px-5 py-5 mx-5 my-5 is-flex is-justify-content-space-evenly"}>
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
            </div>
        </>
    )
}