import {JSX, useState} from "react";
import { PiProjectorScreen, PiFolder } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import Settings from "./Settings.tsx";
import {Link} from "react-router-dom";

export function Sidebar(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const handleSettings: () => void = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <aside className={"menu is-flex is-flex-direction-column is-justify-content-space-between"}>
                <ul className={"menu-list"}>
                    <li>
                        <Link to={"/student/projects"}>
                            <PiProjectorScreen size={30}/>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/student/courses"}>
                            <PiFolder size={30}/>
                        </Link>
                    </li>
                </ul>
                <ul className={"menu-list"}>
                    <li>
                        <a className={"is-transparent"} onClick={handleSettings}><IoMdSettings size={30}/></a>
                    </li>
                </ul>
            </aside>
            {isOpen && <Settings closeSettings={handleSettings}/>}
        </>
    )
}

