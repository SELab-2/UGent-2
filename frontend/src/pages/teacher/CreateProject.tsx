import {JSX} from "react";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import {RegularButton} from "../../components/RegularButton.tsx";
import {useRouteLoaderData} from "react-router-dom";
import {coursesTeacherLoaderObject, CREATE_PROJECT_TEACHER_ID} from "../../dataloaders/CoursesTeacherLoader.ts";

export function CreateProject(): JSX.Element {

    const data = useRouteLoaderData(CREATE_PROJECT_TEACHER_ID) as coursesTeacherLoaderObject;
    console.log(data.courses);

    if (data.courses.length === 0) {
        return <>
            there was an error loading the courses
        </>
    }

    // het enige dat we hier moeten laden zijn alle courses van de teacher
    const emptyProjectTeacher: ProjectTeacher = {
        courseName: data.courses[0].subject_name,
        all_courses: data.courses,
        deadline: new Date(Date.now()),
        description: "",
        groupProject: false,
        hours: 0,
        minutes: 0,
        otherFilesAllow: false,
        projectName: "",
        requiredFiles: "",
        maxGroupMembers: 0,
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
                <div className={"student-main my-3 is-flex is-flex-direction-column"}>
                    <div className={"mx-5"}>
                        <RegularButton placeholder={"Save"} add={false} onClick={() => {
                        }}/>
                    </div>
                    <ProjectTeacherComponent project={emptyProjectTeacher}/>
                </div>
            </div>
        </>
    )
}
