import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ViewProjectStudent from "../../components/ViewProjectStudentComponent.tsx";

export enum ProjectStatus {
    FAILED = "Failed",
    SUCCESS = "Succes",
}

export default function ProjectViewStudent(): JSX.Element {
    const projectName: string = "Markov Decision Diagram"
    const courseName: string = "Automaten, berekenbaarheid en complexiteit"
    const deadline: string = "17:00 - 23/02/2024"
    const status: ProjectStatus = ProjectStatus.FAILED
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel arcu sit amet quam scelerisque vestibulum. Nulla lectus ipsum, convallis ut odio sit amet, auctor dictum felis. Phasellus libero sapien, tempus eu fringilla eu, facilisis vel purus. Quisque odio elit, viverra id tortor eu, blandit luctus turpis. Vestibulum libero felis, condimentum finibus posuere sed, lobortis non tellus. Phasellus laoreet, metus a semper vulputate, mi dui lobortis augue, quis fringilla ipsum felis eu mauris. Donec sem dolor, porta ultrices venenatis eget, ullamcorper id turpis. Nulla quis lacinia sapien. Mauris dignissim nisi id quam vulputate molestie. Fusce eleifend sagittis dolor sit amet aliquam. Aenean in sapien diam. Donec iaculis nunc eu enim pulvinar ultricies. Suspendisse potenti. Etiam quis viverra nunc. Nulla tempus in erat vitae tincidunt. Vestibulum et iaculis nulla."
    const requiredFiles: string[] = ["Diagram.dgr", "verslag.pdf"]
    const groupMembers: { name: string, email: string, lastSubmission: boolean }[] = [
        {name: "jan", email: "jan@ugent.be", lastSubmission: false},
        {name: "erik", email: "erik@ugent.be", lastSubmission: false},
        {name: "peter", email: "peter@ugent.be", lastSubmission: true}]
    const maxGroupMembers: number = 4
    const submission: string | null = "submission.zip"
    return (
        <>
            <div className={"main-header"}>
                <Header page_title={projectName}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main mt-6 mr-6"}>
                    <ViewProjectStudent projectName={projectName} courseName={courseName} deadline={deadline}
                                        status={status}
                                        description={description}
                                        requiredFiles={requiredFiles}
                                        groupMembers={groupMembers}
                                        maxGroupMembers={maxGroupMembers}
                                        submission={submission}
                    />
                </div>
            </div>
        </>
    )
}