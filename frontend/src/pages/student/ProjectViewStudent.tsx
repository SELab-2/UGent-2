import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ViewProjectStudent from "../../components/ProjectStudentComponent.tsx";
import {ProjectStatus, ProjectStudent} from "../../types/project.ts";

export default function ProjectViewStudent(): JSX.Element {
    const groupMembers: { name: string, email: string, lastSubmission: boolean }[] = [
        {name: "jan", email: "jan@ugent.be", lastSubmission: false},
        {name: "erik", email: "erik@ugent.be", lastSubmission: false},
        {name: "peter", email: "peter@ugent.be", lastSubmission: true}
    ]

    const project: ProjectStudent = {
        projectName: "Markov Decision Diagram",
        courseName: "Automaten, berekenbaarheid en complexiteit",
        deadline: "17:00 - 23/02/2024",
        status: ProjectStatus.FAILED,
        description: "Lorem ipsum dolor sit amet.",
        requiredFiles: ["Diagram.dgr", "verslag.pdf"],
        groupMembers: groupMembers,
        maxGroupMembers: 4,
        submission: "submission.zip"
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