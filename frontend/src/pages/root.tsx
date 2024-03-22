import {JSX} from "react";
import useAuth from "../hooks/useAuth.ts";
import {Navigate} from "react-router-dom";

export const DEBUG: boolean = true; // should always be false on the repo.

export default function Root(): JSX.Element {
    const {user} = useAuth()
    let to: string = "/error"
    if (user?.roles) {
        if (user.roles.includes('TEACHER')) {
            to = "/teacher";
        } else if (user.roles.includes('STUDENT')) {
            to = "/student";
        } else if (user.roles.includes('ADMIN')) {
            to = "/admin";
        }
    }
    return (<Navigate to={to}/>)
}