import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";

export default function LoginScreen(): JSX.Element {
    return (
        <>
            <div className={"main-header"}>
                <Header/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar"}>
                    <Sidebar/>
                </div>
                <div>
                    <>Login screen</>
                </div>
            </div>
        </>
    )
}