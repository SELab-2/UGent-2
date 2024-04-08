import {JSX, useState} from "react";
import Inputfield from "../../components/Inputfield.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {RegularButton} from "../../components/RegularButton.tsx";

export default function CreateCourse(): JSX.Element {
    const [projectName, setProjectName] = useState<string>("");

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Create course"} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main my-5"}>
                    <div className={"field is-horizontal"}>
                        <div className={"field-label"}>
                            <label className="label">Project naam:</label>
                        </div>
                        <div className="field-body field">
                            <Inputfield placeholder="Geef een naam in" value={projectName}
                                        setValue={setProjectName}/>
                        </div>
                    </div>
                    <div className={"is-flex is-justify-content-center"}>
                        {/*Waiting for the post requests to implement the on click*/}
                        <RegularButton placeholder={"Bevestigen"} add={false} onClick={() => {}}/>
                    </div>
                </div>
            </div>
        </>
    )
}