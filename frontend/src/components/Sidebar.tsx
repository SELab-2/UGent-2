import {JSX, useState} from "react";
import { IoHomeSharp } from "react-icons/io5";
import { PiProjectorScreen, PiFolder } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import Settings from "./Settings.tsx";

export function Sidebar(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const handleSettings: () => void = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <aside className={"menu is-flex is-flex-direction-column is-justify-content-space-between"}>
                <ul className={"menu-list"}>
                    <li><a><IoHomeSharp size={30}/></a></li>
                    <li><a><PiProjectorScreen size={30}/></a></li>
                    <li><a><PiFolder size={30}/></a></li>
                </ul>
                <ul className={"menu-list"}>
                    <li><a className={"is-transparent"} onClick={handleSettings}><IoMdSettings size={30}/></a>
                    </li>
                </ul>
            </aside>
            {isOpen && <Settings closeSettings={handleSettings}/>}
        </>
    )
}

