import {JSX} from "react";
import DefaultErrorPage from "../DefaultErrorPage.tsx";

export default function Unauthorized(): JSX.Element {
    return (
        DefaultErrorPage(
            "Access to this page is restricted",
            "Please check with an admin if you believe this is a mistake."
        )
    )
}