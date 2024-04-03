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
                            <PiProjectorScreen/>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/student/courses"}>
                            <PiFolder/>
                        </Link>
                    </li>
                </ul>
                <ul className={"menu-list"}>
                    <li>
                        <a className={"is-transparent mb-5"} onClick={handleSettings}><IoMdSettings/></a>
                    </li>
                </ul>
            </aside>
            {isOpen &&
                <Settings closeSettings={handleSettings}/>
            }
        </>
    )
}

