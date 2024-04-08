import {JSX, useState} from "react";
import { PiProjectorScreen, PiFolder } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import Settings from "./Settings.tsx";
import { SidebarButton } from "../others/enums.tsx";
import {Link} from "react-router-dom";

export function Sidebar(props: {home: string, buttons?: SidebarButton[]}): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const handleSettings: () => void = () => {
        setIsOpen(!isOpen)
    }

    let buttons = props.buttons
    if (buttons == undefined) {
        buttons = [SidebarButton.COURSES, SidebarButton.PROJECTS];
    }
    
    return (
        <>
            <aside className={"menu is-flex is-flex-direction-column is-justify-content-space-between"}>
                <ul className={"menu-list"}>
                    {SidebarButton.COURSES in buttons &&
                        <li>
                            <Link to={`/${props.home}/projects`}>
                                <PiProjectorScreen/>
                            </Link>
                        </li>
                    }
                    {SidebarButton.PROJECTS in buttons &&
                        <li>
                            <Link to={`/${props.home}/courses`}>
                                <PiFolder/>
                            </Link>
                        </li>
                    }
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

