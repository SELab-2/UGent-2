import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import Statistics from "../../components/Statistics.tsx";
import {RegularButton} from "../../components/RegularButton.tsx";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECT_TEACHER, ProjectTeacherLoaderObject} from "../../dataloaders/ProjectTeacher.ts";
import {useTranslation} from 'react-i18next';
import DefaultErrorPage from "../../components/DefaultErrorPage.tsx";
import {DEBUG} from "../root.tsx";
import {FaDownload} from "react-icons/fa6";

export default function ProjectViewTeacher() {

    const {t} = useTranslation();

    const data: ProjectTeacherLoaderObject = useRouteLoaderData(PROJECT_TEACHER) as ProjectTeacherLoaderObject
    const project_data = data.project

    if (!project_data) {
        return <DefaultErrorPage title={t("project_error.title")} body={"project_error.text"}/>
    }

    const deadline_date = new Date(project_data.project_deadline)


    const project: ProjectTeacher = {
        projectId: project_data.project_id,
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

    async function downloadAllSubmissions() {
        let url = ''
        if (DEBUG) {
            url = 'http://localhost:8000'
        }
        const response = await fetch(
            `${url}/api/projects/${project.projectId}/submissions`,
            {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}
        )
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `${project.projectName}_all_submissions.zip` ?? "project_all_submissions.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
                <div className={"student-main my-3 is-flex is-flex-direction-column"}>
                    <div className={"mx-5 mb-5 is-flex is-justify-content-start"}>
                        <RegularButton placeholder={t('project.save')} add={false} onClick={() => {
                        }}/>
                        <div className={"mr-5"}/>
                        <Statistics statistics={project_data.submission_statistics}/>
                        <div className={"mr-5"}/>
                        <button className="js-modal-trigger button is-rounded is-pulled-right"
                                onClick={() => void downloadAllSubmissions()}>
                            <span className="icon is-small">
                                <FaDownload/>
                            </span>
                            <span>{t('download.download_all')}</span>
                        </button>
                    </div>
                    <ProjectTeacherComponent project={project}/>
                </div>
            </div>
        </>
    )
}