import {BiLogOut} from "react-icons/bi";
import '../assets/styles/small_components.css'
import {JSX} from "react";
import {Link} from "react-router-dom";
import { IoMdClose } from "react-icons/io";


export default function Settings(props: {closeSettings: () => void}): JSX.Element {
    return (
        <div className={"card popup"}>
            <div className={"is-flex is-align-items-center is-justify-content-right"}>
                <button className={"px-1 py-1 mx-1 my-1"} onClick={props.closeSettings}><IoMdClose/></button>
            </div>
            <div className={"px-5 pb-5"}>
                <p className={"title is-flex is-justify-content-center"}>Settings</p>
                <img src={"/delphi_full.png"} alt={"image"}/>
                <div className={"is-flex px-5 py-1 is-align-items-center"}>
                    <p>Logout: </p>
                    <a className={"button mx-5 px-2"}><BiLogOut size={25}></BiLogOut></a>
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