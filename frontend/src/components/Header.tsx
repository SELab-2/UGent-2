import {JSX} from "react";
import {RiAccountPinBoxLine} from "react-icons/ri";
import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";

export function Header(props: { page_title: string, home: string }): JSX.Element {

    const {user} = useAuth()

    return (
        <nav className={"main-nav is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center above-all-others"}>
            <Link to={`/${props.home}`} className={"logo-div is-flex is-align-items-center"}>
                <img src={"/logo.png"} alt={"image"}/>
            </Link>
            <div className={"is-align-self-center"}><p>{props.page_title}</p></div>
            <div className="above-all-others">
                <button className={"button mx-2 is-transparent"} style={{cursor: "default"}}>
                    <div className={"icon-text"}>
                        <p>{user?.user_name}</p>
                        <RiAccountPinBoxLine className={"icon"}/>
                    </div>
                </button>
            </div>
        </nav>
    )
}
