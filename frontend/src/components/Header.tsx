import {JSX} from "react";
import {RiAccountPinBoxLine} from "react-icons/ri";

export function Header(): JSX.Element {
    return (
        <nav className={"main-nav is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"}>
            <img src={"/delphi_favicon_circle.png"} alt={"image"}/>
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
