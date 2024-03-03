import {JSX} from "react";
import {Link} from "react-router-dom";

export default function Root(): JSX.Element {
    // TODO: logic to send user to /login or
    return (
        <>
            <>Redirecting ...</>
            <Link to={`/login`}>goto login page</Link>
        </>
)
}