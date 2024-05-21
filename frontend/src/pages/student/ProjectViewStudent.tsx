import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ViewProjectStudent from "../../components/ProjectStudentComponent.tsx";
import {ProjectStatus, ProjectStudent} from "../../types/project.ts";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECT_STUDENT, ProjectStudentLoaderObject} from "../../dataloaders/ProjectStudent.ts";
import {SUBMISSION_STATE} from "../../utils/ApiInterfaces.ts";
import DefaultErrorPage from "../../components/DefaultErrorPage.tsx";
import {useTranslation} from "react-i18next";
import {deadline_to_string} from "../../utils/helper.ts";

export default function ProjectViewStudent(): JSX.Element {

    const { t } = useTranslation();

    const data: ProjectStudentLoaderObject = useRouteLoaderData(PROJECT_STUDENT) as ProjectStudentLoaderObject
    const project_data = data.project

    if (!project_data) {
        return <DefaultErrorPage title={t("project_error.title")} body={t("project_error.text")}/>
    }

    const statusMap = {
        [SUBMISSION_STATE.Pending]: ProjectStatus.PENDING,
        [SUBMISSION_STATE.Approved]: ProjectStatus.SUCCESS,
        [SUBMISSION_STATE.Rejected]: ProjectStatus.FAILED
    };

    const project_status = statusMap[project_data.submission_state] || ProjectStatus.FAILED;


    const groupMembers: {
        name: string;
        email: string;
        lastSubmission: boolean
    }[] | undefined = project_data.group_members?.map((member) => {
        return {
            name: member?.user_name ?? "name",
            email: member?.user_email ?? "email",
            lastSubmission: project_data.submission_student_id === member?.user_id
        }
    });
    const project: ProjectStudent = {
        projectId: project_data.project_id,
        projectName: project_data.project_name,
        courseName: project_data.course_name,
        deadline: deadline_to_string(project_data.project_deadline),
        status: project_status,
        description: project_data.project_description,
        requiredFiles: JSON.parse(project_data.project_requirements) as object,
        group_id: project_data.group_id,
        groups_info: project_data.groups_info,
        groupMembers: groupMembers,
        maxGroupMembers: project_data.project_max_students,
        submission: project_data.submission_file
    }

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={project.projectName} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main px-6"}>
                    <ViewProjectStudent project={project}/>
                </div>
            </div>
        </>
    )
}