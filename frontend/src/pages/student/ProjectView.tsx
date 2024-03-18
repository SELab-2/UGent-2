import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ViewProjectStudent from "../../components/ViewProjectStudent.tsx";

export default function ProjectView(): JSX.Element {
    
    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"PROJECTNAAM"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main mt-6 mr-6"}>
                    <ViewProjectStudent/>
                </div>
            </div>
        </>
    )
}