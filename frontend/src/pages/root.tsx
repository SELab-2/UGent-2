import {JSX} from "react";
import useAuth from "../hooks/useAuth.ts";
import {Navigate} from "react-router-dom";

export let DEBUG: boolean = false;
if (import.meta.env.VITE_DEBUG) { // VITE_ prefix required
    DEBUG = true;
}


export default function Root(): JSX.Element {
    const {user} = useAuth()
    let to: string = "/error"

    if (user?.user_roles.includes('TEACHER')) {
        to = "/teacher";
    } else if (user?.user_roles.includes('STUDENT')) {
        to = "/student";
    } else if (user?.user_roles.includes('ADMIN')) {
        to = "/admin";
    }

    return <Navigate to={to}/>
}