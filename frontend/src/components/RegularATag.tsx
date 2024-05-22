import {JSX} from "react";
import {IoMdAdd} from "react-icons/io";
import {Link} from "react-router-dom";

export function RegularATag(props: { link: string, text: string, add: boolean }): JSX.Element {
    return (
        <Link className={"button"} to={`/${props.link}`}>
            {props.add ? (
                <span className="icon">
                    <IoMdAdd/>
                </span>
            ) : null}
            <span>{props.text}</span>
        </Link>
    );
}
