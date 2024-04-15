import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ViewProjectStudent from "../../components/ProjectStudentComponent.tsx";
import {ProjectStatus, ProjectStudent} from "../../types/project.ts";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECT_STUDENT, ProjectStudentLoaderObject} from "../../dataloaders/ProjectStudent.ts";
import {SUBMISSION_STATE} from "../../utils/ApiInterfaces.ts";

export default function ProjectViewStudent(): JSX.Element {

    const data: ProjectStudentLoaderObject = useRouteLoaderData(PROJECT_STUDENT) as ProjectStudentLoaderObject
    const project_data = data.project

    if (!project_data) {
        return <>
            there was an error loading the project
        </>
    }

    let project_status;
    switch (project_data.submission_state) {
        case SUBMISSION_STATE.Pending:
            project_status = ProjectStatus.PENDING;
            break;
        case SUBMISSION_STATE.Approved:
            project_status = ProjectStatus.SUCCESS;
            break;
        default:
            project_status = ProjectStatus.FAILED;
    }

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

    const deadline_date = new Date(project_data.project_deadline)
    const deadline = `${deadline_date.getHours()}:${deadline_date.getMinutes()} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`
    console.log(project_data.project_requirements)
    const project: ProjectStudent = {
        projectName: project_data.project_name,
        courseName: project_data.subject_name,
        deadline: deadline,
        status: project_status,
        description: project_data.project_description,
        requiredFiles: JSON.parse(project_data.project_requirements),
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
                <div className={"student-main pt-6 px-6"}>
                    <ViewProjectStudent project={project}/>
                </div>
            </div>
        </>
    )
}