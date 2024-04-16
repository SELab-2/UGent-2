import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import Statistics from "../../components/Statistics.tsx";
import {RegularButton} from "../../components/RegularButton.tsx";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECT_TEACHER, ProjectTeacherLoaderObject} from "../../dataloaders/ProjectTeacher.ts";
import {useTranslation} from 'react-i18next';

export default function ProjectViewTeacher() {

    const { t } = useTranslation();

    const data: ProjectTeacherLoaderObject = useRouteLoaderData(PROJECT_TEACHER) as ProjectTeacherLoaderObject
    const project_data = data.project
    console.log(project_data)

    if (!project_data) {
        return <>
            there was an error loading the project
        </>
    }

    const deadline_date = new Date(project_data.project_deadline)


    const project: ProjectTeacher = {
        projectName: project_data.project_name,
        all_courses: project_data.subjects,
        courseName: project_data.subject_name,
        hours: deadline_date.getHours(),
        minutes: deadline_date.getMinutes(),
        deadline: deadline_date,
        description: project_data.project_description,
        maxGroupMembers: project_data.project_max_students,
        requiredFiles: 'Diagram.dgr,verslag.pdf', //TODO dit veranderen naar een echte file structue
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
                <div className={"student-main my-3 is-flex is-flex-direction-column"}>
                    <div className={"mx-5 mb-5 is-flex is-justify-content-start"}>
                        <RegularButton placeholder={t('project.save')} add={false} onClick={() => {}}/>
                        <div className={"mr-5"}/>
                        <Statistics statistics={project_data.submission_statistics}/>
                    </div>
                    <ProjectTeacherComponent project={project}/>
                </div>
            </div>
        </>
    )
}