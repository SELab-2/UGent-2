import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";

export default function HomeAdmin(): JSX.Element {
    return (
        <>
            <div className={"main-header"}>
                <Header/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar buttons={[]}/>
                </div>
                <div className={"admin-main is-flex"}>
                    <>Test</>
                </div>
            </div>
        </>
    )
}