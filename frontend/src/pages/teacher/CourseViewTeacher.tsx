import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {Table} from "../../components/Table.tsx";
import {IoExitOutline} from "react-icons/io5";
import {TableRowOverviewProjects, TableRowPeople} from "../../types/tableRows.ts";
import CopyLink from "../../components/CopyLink.tsx";
import Archive from "../../components/Archive.tsx";
import ManageCourse from "../../components/ManageCourse.tsx";

export default function CourseViewTeacher(): JSX.Element {
    const tableProjects: TableRowOverviewProjects[] = [
        {
            project: {
                name: "RSA security",
                id: 1234
            },
            status: null,
            deadline: "23:59 - 27/02/2024"
        },
        {
            project: {
                name: "Symmetric encryption",
                id: 5897
            },
            status: null,
            deadline: "23:59 - 03/03/2024"
        }
    ];

    const teachers: TableRowPeople[] = [
        {
            name: "Maarten Vermeiren",
            email: "maarten.vermeiren@ugent.be"
        },
        {
            name: "Anke De Groot",
            email: "anke.degroot@ugent.be"
        }
    ];

    const students: TableRowPeople[] = [
        {
            name: "Bart De Jong",
            email: "bart.dejong@ugent.be"
        },
        {
            name: "Siemen Janssens",
            email: "siemen.janssens@ugent.be"
        }
    ];

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Courses"} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <div className={"is-flex is-align-items-center is-justify-content-space-between"}>
                            <div className={"my-5 is-flex"}>
                                <RegularATag link={"teacher/projects/create"} text={"nieuw project"} add={true}/>
                                {/*<button className={"button ml-4 mr-2"}><CiLink size={25}/></button>*/}
                                <div className={"ml-4 mr-2"}><CopyLink/></div>
                                {/*<button className={"button mx-2"}><MdManageAccounts size={25}/></button>*/}
                                <div className={"mx-2"}><ManageCourse teachers={teachers}/></div>
                                {/*<button className={"button mx-2"}><FaArchive size={25}/></button>*/}
                                <div className={"mx-2"}><Archive/></div>
                            </div>
                            <button className={"button mx-2 is-danger"}><IoExitOutline size={25}/></button>
                        </div>
                        <div className={"my-5"}/>
                        <Table title={"projecten"} data={tableProjects} ignoreKeys={["status"]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={"lesgevers"} data={teachers} ignoreKeys={[]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={"studenten"} data={students} ignoreKeys={[]} home={"teacher"}/>
                    </div>
                </div>
            </div>
        </>
    )
}