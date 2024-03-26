import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/admin.css'
import { SearchBar } from "../../components/SearchBar.tsx";

export default function HomeAdmin(): JSX.Element {

    const placeholder = "Zoek persoon"
    const teacher_main = "Geef lesgever-rechten"
    const teacher_sub = "(kies tussen alle studenten)"
    const admin_main = "Verander admin-rechten"
    const admin_sub = "(kies tussen alle studenten/lesgevers)"

    return (
        <>
            <div className={"main-header"}>
                <Header title="Admin"/>
            </div>
            <div className={"main-content"}>
                <div className={"side-bar"}>
                    <Sidebar buttons={[]}/>
                </div>
                <div className={"admin-main"}>
                    <div className={"rights-list"}>
                        <div className={"rights-block"}>
                            <p className={"explanation"}>
                                <p className={"main"}>{teacher_main}</p>
                                <p className={"sub"}>{teacher_sub}</p>
                            </p>
                            <SearchBar placeholder={placeholder}></SearchBar>
                            <div className="person-list">
                                
                            </div>
                        </div>
                        <div className={"rights-block"}>
                            <p className={"explanation"}>
                                <p className={"main"}>{admin_main}</p>
                                <p className={"sub"}>{admin_sub}</p>
                            </p>
                            <SearchBar placeholder={placeholder}></SearchBar>
                            <div className="person-list">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
// <Table title="test" keys={["Naam", "Aantal projecten", "Kortste deadline"]}></Table>
//<SearchBar placeholder="test"></SearchBar>
//<Inputfield placeholder="test"></Inputfield>
//<RegularButton placeholder="test" add={false}></RegularButton>
//<SelectionBox options={["1","2"]}></SelectionBox>