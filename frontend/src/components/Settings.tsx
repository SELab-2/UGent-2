import { BiLogOut } from "react-icons/bi";
import '../assets/styles/small_components.css'


export default function Settings() {
    return (
        <>
            <div className={"popup px-5 py-5 card"}>
                <p className={"title is-flex is-justify-content-center"}>Settings</p>
                <img src={"/delphi_full.png"} alt={"image"}/>
                <div className={"is-flex px-5 py-1 is-align-items-center"}>
                    <p>Logout: </p>
                    <a className={"button mx-5 px-2"}><BiLogOut size={25}></BiLogOut></a>
                </div>
                <div>
                    <p className={"py-2"}>Select workstation: </p>
                    <div className={"is-flex is-justify-content-space-evenly"}>
                        <button className={"button is-success"}>teacher</button>
                        <button className={"button is-danger"}>admin</button>
                    </div>
                </div>
            </div>
        </>
    )
}