import {JSX} from "react";
import {teacherLoaderObject} from "../../dataloaders/TeacherLoader.ts";
import {useRouteLoaderData} from "react-router-dom";

export default function HomeTeacher(): JSX.Element {

    const data: teacherLoaderObject = useRouteLoaderData("teacher") as teacherLoaderObject;
    console.log(data);

    return (
        <>Homescreen for a teacher</>
    )
}