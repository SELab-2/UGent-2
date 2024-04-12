import {JSX} from "react";
import {RiAccountPinBoxLine} from "react-icons/ri";
import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";
import { MdLanguage } from "react-icons/md";
import '../assets/styles/header.css'
import Popup from 'reactjs-popup';
import i18n from "../i18n.tsx";

export function Header(props: { page_title: string, home: string }): JSX.Element {
    
    const {user} = useAuth()

    return (
        <nav className={"main-nav is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center above-all-others"}>
            <Link to={`/${props.home}`} className={"logo-div is-flex is-align-items-center"}>
                <img src={"/logo.png"} alt={"image"}/>
            </Link>
            <div className={"is-align-self-center"}><p>{props.page_title}</p></div>
            <div className="above-all-others">
                
                <Popup trigger={
                    <button className={"button mx-2 is-transparent"}>
                        <div className={"icon-text"}>
                            <p>{i18n.resolvedLanguage}</p>
                            <MdLanguage className={"icon"}/>
                        </div>
                    </button>
                } position="left center" arrow={true} on="hover">
                    <div className="menu">
                        <div className="menu-item" id="language" key="language">
                            <button className={"button mx-2 is-transparent is-small is-primary"} 
                                    disabled={i18n.resolvedLanguage === "en"}
                                    onClick={() => void i18n.changeLanguage("en")}>
                                <p>en</p>
                            </button>
                            <button className={"button mx-2 is-transparent is-small is-primary"}
                                    disabled={i18n.resolvedLanguage === "nl"}
                                    onClick={() => void i18n.changeLanguage("nl")}>
                                <p>nl</p>
                            </button>
                        </div>
                    </div>
                </Popup>
                    
                <button className={"button mx-2 is-transparent"}>
                    <div className={"icon-text"}>
                        <p>{user?.user_name}</p>
                        <RiAccountPinBoxLine className={"icon"}/>
                    </div>
                </button>
            </div>
        </nav>
    )
}
