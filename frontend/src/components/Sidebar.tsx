import {JSX, useState} from "react";
import { PiProjectorScreen, PiFolder } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import Settings from "./Settings.tsx";

export enum SidebarButton {
    COURSES,
    PROJECTS
}


export function Sidebar(params: {buttons?: SidebarButton[]}): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const handleSettings: () => void = () => {
        setIsOpen(!isOpen)
    }

    var buttons = params.buttons
    if (buttons == undefined) {
        buttons = [SidebarButton.COURSES, SidebarButton.PROJECTS];
    }
    
    return (
        <>
            <aside className={"menu is-flex is-flex-direction-column is-justify-content-space-between"}>
                <ul className={"menu-list"}>
                    {SidebarButton.COURSES in buttons &&
                        (<li><a><PiProjectorScreen/></a></li>)
                    }
                    {SidebarButton.PROJECTS in buttons &&
                        (<li><a><PiFolder/></a></li>)
                    }
                </ul>
                <ul className={"menu-list"}>
                    <li>
                        <a className={"is-transparent"} onClick={handleSettings}><IoMdSettings/></a>
                    </li>
                </ul>
            </aside>
            {isOpen && <Settings closeSettings={handleSettings}/>}
        </>
    )
}

