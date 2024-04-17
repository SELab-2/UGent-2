import {JSX, useState} from "react";
import {BiLogOut} from "react-icons/bi";
import '../assets/styles/small_components.css'
import {Link} from "react-router-dom";
import {IoMdClose} from "react-icons/io";
import {MdLanguage, MdOutlineKeyboardArrowDown} from "react-icons/md";
import {modify_language} from "../utils/api/User.ts";

export type Language = "NL" | "EN";

function DropdownLanguage(props: { language: Language, changeLanguage: (language: Language) => void }): JSX.Element {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = (): void => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggle}>
                    <span className={"is-flex is-align-items-center px"}>
                        <MdLanguage className={"mr-2"}/><p>{props.language}</p>
                    </span>
                    <span className="icon is-small">
                        <MdOutlineKeyboardArrowDown/>
                    </span>
                </button>
            </div>
            <div className={"dropdown-menu"}>
                <div className="dropdown-content">
                    <a href="#" className="dropdown-item" onClick={() => {props.changeLanguage("EN"); toggle()}}>
                        English
                    </a>
                    <a className="dropdown-item" onClick={() => {props.changeLanguage("NL"); toggle()}}>
                        Nederlands
                    </a>
                </div>
            </div>
        </div>
    )
}

function Settings(props: { closeSettings: () => void }): JSX.Element {

    // TODO: get current language from user
    const currLang: Language = "NL";
    const [language, setLanguage] = useState<Language>(currLang);

    const changeLanguage = (newLang: Language): void => {
        if (language !== newLang) {
            modify_language(newLang);
            setLanguage(newLang);
        }
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("to")
    }

    return (
        <div className={"card popup"}>
            <div className={"is-flex is-align-items-center is-justify-content-right"}>
                <span className={"py-2"}>
                    <DropdownLanguage language={language} changeLanguage={changeLanguage}/>
                </span>
                <button className={"button mx-2 my-1"} onClick={props.closeSettings}><IoMdClose/></button>
            </div>
            <div className={"px-5 pb-5"}>
                <p className={"title is-flex is-justify-content-center"}>Settings</p>
                <img src={"/delphi_full.png"} alt={"image"}/>
                <div className={"is-flex px-5 py-1 is-align-items-center"}>
                    <p>Logout: </p>
                    <a className={"button mx-5 px-2"} onClick={logout} href={"/"}><BiLogOut size={25}></BiLogOut></a>
                </div>
                <div>
                    <p className={"py-2"}>Select workstation: </p>
                    <div className={"is-flex is-justify-content-space-evenly"}>
                        <Link to={"/teacher"}>
                            <button className={"button is-success"}>teacher</button>
                        </Link>
                        <Link to={"/admin"}>
                            <button className={"button is-danger"}>admin</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;