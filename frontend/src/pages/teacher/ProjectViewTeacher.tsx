import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECT_TEACHER, ProjectTeacherLoaderObject} from "../../dataloaders/ProjectTeacher.ts";
import {useTranslation} from 'react-i18next';
import DefaultErrorPage from "../../components/DefaultErrorPage.tsx";

export default function ProjectViewTeacher() {

    const { t } = useTranslation();

    const data: ProjectTeacherLoaderObject = useRouteLoaderData(PROJECT_TEACHER) as ProjectTeacherLoaderObject
    const project_data = data.project

    if (!project_data) {
        return <DefaultErrorPage title={t("project_error.title")} body={"project_error.text"}/>
    }

    const deadline_date = new Date(project_data.project_deadline)


    const project: ProjectTeacher = {
        projectName: project_data.project_name,
        all_courses: project_data.courses,
        courseName: project_data.course_name,
        hours: deadline_date.getHours(),
        minutes: deadline_date.getMinutes(),
        deadline: deadline_date,
        description: project_data.project_description,
        maxGroupMembers: project_data.project_max_students,
        requiredFiles: project_data.project_requirements,
        otherFilesAllow: true,
        groupProject: project_data.project_max_students > 1,
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
                <div className={"student-main is-flex is-flex-direction-column"}>
                    <ProjectTeacherComponent project={project} submission_statistics={project_data.submission_statistics}/>
                </div>
            </div>
        </>
    )
}