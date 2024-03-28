import {JSX} from "react";
import {TEACHER_ROUTER_ID, teacherLoaderObject} from "../../dataloaders/TeacherLoader.ts";
import {useRouteLoaderData} from "react-router-dom";

export default function HomeTeacher(): JSX.Element {

    const data: teacherLoaderObject = useRouteLoaderData(TEACHER_ROUTER_ID) as teacherLoaderObject;
    console.log(data);

    return (
        <>Homescreen for a teacher</>
    )
}