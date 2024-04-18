import {JSX} from "react";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import {RegularButton} from "../../components/RegularButton.tsx";
import {useTranslation} from 'react-i18next';
import {useRouteLoaderData} from "react-router-dom";
import {coursesTeacherLoaderObject, CREATE_PROJECT_TEACHER_ID} from "../../dataloaders/CoursesTeacherLoader.ts";
import DefaultErrorPage from "../../components/DefaultErrorPage.tsx";

export function CreateProject(): JSX.Element {

    const { t } = useTranslation();

    const data = useRouteLoaderData(CREATE_PROJECT_TEACHER_ID) as coursesTeacherLoaderObject;

    if (data.courses.length === 0) {
        return <DefaultErrorPage title={t("create_project.error_title")} body={t("create_project.error_text")}/>
    }

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
                <Header page_title={t('create_project.title')} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main my-3 is-flex is-flex-direction-column"}>
                    <div className={"mx-5"}>
                        <RegularButton placeholder={t('create_project.save_button')} add={false} onClick={() => {}}/>
                    </div>
                    <ProjectTeacherComponent project={emptyProjectTeacher}/>
                </div>
            </div>
        </>
    )
}
