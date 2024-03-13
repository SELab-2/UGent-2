import {JSX} from "react";
import {SUBJECT_TEACHER_ROUTER_ID, subjectsTeacherLoaderObject} from "../../dataloaders/SubjectsTeacherLoader.ts";
import {useRouteLoaderData} from "react-router-dom";

export default function SubjectsTeacher(): JSX.Element {

    const data= useRouteLoaderData(SUBJECT_TEACHER_ROUTER_ID) as subjectsTeacherLoaderObject;
    console.log(data);

    return(
        <p>hier ziet de lkr al zijn vakken.</p>
    )
}