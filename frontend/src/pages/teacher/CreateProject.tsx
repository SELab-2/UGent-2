import {JSX} from "react";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import {useTranslation} from 'react-i18next';
import {useRouteLoaderData} from "react-router-dom";
import {coursesTeacherLoaderObject, CREATE_PROJECT_TEACHER_ID} from "../../dataloaders/CoursesTeacherLoader.ts";
import DefaultErrorPage from "../../components/DefaultErrorPage.tsx";

export function CreateProject(): JSX.Element {

    const {t} = useTranslation();

    const data = useRouteLoaderData(CREATE_PROJECT_TEACHER_ID) as coursesTeacherLoaderObject;

    if (data.courses.length === 0) {
        return <DefaultErrorPage title={t("create_project.error_title")} body={t("create_project.error_text")}/>
    }

    const emptyProjectTeacher: ProjectTeacher = {
        projectId: -1,
        courseName: data.courses[0].course_name,
        all_courses: data.courses,
        deadline: new Date(Date.now()),
        description: "",
        groupProject: false,
        hours: 0,
        minutes: 0,
        amount_groups: 1,
        otherFilesAllow: false,
        visible: false,
        archived: false,
        projectName: "",
        requiredFiles: {
            type: "SUBMISSION",
            root_constraint: {
                type: "FILE",
                file_name: "CHANGE_ME"
            }
        },
        maxGroupMembers: 1,
        dockerFile: ""
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
                <div className={"student-main is-flex is-flex-direction-column"}>
                    <ProjectTeacherComponent
                        project={emptyProjectTeacher}
                        submission_statistics={undefined}
                        download_all_submissions={undefined}
                        is_new={true}/>
                </div>
            </div>
        </>
    )
}
