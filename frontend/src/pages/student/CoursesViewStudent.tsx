import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/students_components.css'
import ViewCoursesStudentComponent from "../../components/ViewCoursesStudentComponent.tsx";

export default function CoursesViewStudent(): JSX.Element {
    return (
        <>
            <div className={"main-header"}>
                <Header/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <ViewCoursesStudentComponent/>
                </div>
            </div>
        </>
    )
}