import {JSX, useState} from "react";
import {BiLogOut} from "react-icons/bi";
import '../assets/styles/small_components.css'
import {Link} from "react-router-dom";
import {IoMdClose, IoMdSettings} from "react-icons/io";
import {MdLanguage, MdOutlineKeyboardArrowDown} from "react-icons/md";
import useAuth from "../hooks/useAuth.ts";
import {User} from "../utils/ApiInterfaces.ts";
import {useTranslation} from "react-i18next";
import {modify_language} from "../utils/api/User.ts";

function DropdownLanguage(): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = (): void => {
        setIsOpen(!isOpen);
    }

    const {t} = useTranslation();

    return (
        <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggle}>
                    <span className={"is-flex is-align-items-center px"}>
                        <MdLanguage className={"mr-2"}/><p>{t('settings.current_language')}</p>
                    </span>
                    <span className="icon is-small">
                        <MdOutlineKeyboardArrowDown/>
                    </span>
                </button>
            </div>
            <div className={"dropdown-menu"}>
                <div className="dropdown-content">
                    <a
                        className="dropdown-item"
                        onClick={() => {
                            modify_language("en")
                            toggle()
                        }}
                    >
                        {t('settings.english')}
                    </a>
                    <a
                        className="dropdown-item"
                        onClick={() => {
                            modify_language("nl")
                            toggle()
                        }}
                    >
                        {t('settings.dutch')}
                    </a>
                </div>
            </div>
        </div>
    )
}

function workstationsAvailable(user: User | undefined, home: string, workstation: string) {
    return user?.user_roles.includes(workstation.toUpperCase()) && home != workstation;
}

function Settings(props: { home: string }): JSX.Element {
    const {user} = useAuth()

    const [isModalActive, setIsModalActive] = useState(false);

    const handleSettings: () => void = () => {
        setIsModalActive(!isModalActive)
    }


    const {t} = useTranslation();
    const ROLES = ["STUDENT", "TEACHER", "ADMIN"];
    const available_workstations = ROLES.filter(role => user?.user_roles.includes(role)).length;

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("to")
    }

    return (
        <div>
            <li>
                <a className={"is-transparent mb-5"} onClick={handleSettings}><IoMdSettings/></a>
            </li>
            <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
                <div className={"modal-background"} onClick={handleSettings}/>
                <div className={"card popup"}>
                    <div className={"is-flex is-align-items-center is-justify-content-right"}>
                <span className={"py-2"}>
                    <DropdownLanguage/>
                </span>
                        <button className={"button mx-2 my-1"} onClick={handleSettings}><IoMdClose/></button>
                    </div>
                    <div className={"px-5 pb-5"}>
                        <p className={"title is-flex is-justify-content-center"}>{t('settings.settings')}</p>
                        <img src={"/delphi_full.png"} alt={"image"}/>
                        <div className={"is-flex px-5 py-1 is-align-items-center"}>
                            <p>{t('settings.logout')}</p>
                            <a className={"button mx-5 px-2"} onClick={logout} href={"/"}><BiLogOut
                                size={25}></BiLogOut></a>
                        </div>
                        {available_workstations > 1 &&
                            <div>
                                <p className={"py-2"}>{t('settings.workstation')}</p>
                                <div className={"is-flex is-justify-content-space-evenly"}>
                                    {workstationsAvailable(user, props.home, "student") &&
                                        <Link to={"/student"}>
                                            <button className={"button is-info mx-1"}>{t('settings.student')}</button>
                                        </Link>
                                    }
                                    {workstationsAvailable(user, props.home, "teacher") &&
                                        <Link to={"/teacher"}>
                                            <button
                                                className={"button is-success mx-1"}>{t('settings.teacher')}</button>
                                        </Link>
                                    }
                                    {workstationsAvailable(user, props.home, "admin") &&
                                        <Link to={"/admin"}>
                                            <button className={"button is-danger mx-1"}>{t('settings.admin')}</button>
                                        </Link>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;