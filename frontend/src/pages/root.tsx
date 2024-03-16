import {JSX} from "react";
import useAuth from "../hooks/useAuth.ts";
import {Navigate} from "react-router-dom";

export default function Root(): JSX.Element {
    const {user} = useAuth()
    let to: string = "/error"
    console.log(user?.roles.includes('STUDENT'))
    if (!user){
        to = "/login"
    }
    if (user?.roles) {
        if (user.roles.includes('TEACHER')) {
            to = "/teacher";
        } else if (user.roles.includes('STUDENT')) {
            to = "/student";
        } else if (user.roles.includes('ADMIN')) {
            to = "/admin";
        }
    }
    console.log(to);
    return (<Navigate to={to}/>)
}