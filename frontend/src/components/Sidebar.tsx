import {JSX} from "react";
import { IoHomeSharp } from "react-icons/io5";
import { PiProjectorScreen, PiFolder } from "react-icons/pi";

export function Sidebar(): JSX.Element {
    return (
        <aside className={"menu"}>
            <ul className={"menu-list"}>
                <li><a className={"is-transparent"}><IoHomeSharp size={30}/></a></li>
                <li><a className={"is-transparent"}><PiProjectorScreen size={30}/></a></li>
                <li><a className={"is-transparent"}><PiFolder size={30}/></a></li>
            </ul>
        </aside>
    )
}

