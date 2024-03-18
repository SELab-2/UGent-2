import {JSX} from "react";
import {RiAccountPinBoxLine} from "react-icons/ri";
import {Link} from "react-router-dom";

export function Header(): JSX.Element {
    return (
        <nav
            className={"main-nav is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"}>
            <Link to={"/"} className={"main-nav"}>
                <img src={"/logo.png"} alt={"image"}/>
            </Link>
            <p className={"is-align-self-center"}><p>Home</p></p>
            <button className={"button mx-2 is-transparent"}>
                <div className={"icon-text"}>
                    <p>Username</p>
                    <RiAccountPinBoxLine className={"icon"}/>
                </div>
            </button>
        </nav>
    )
}
