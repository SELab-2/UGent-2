import {JSX} from "react";
import {IoMdAdd} from "react-icons/io";

export function RegularButton(props: { placeholder: string, add: boolean, onClick: () => void, styling?: string }): JSX.Element {
    return (
        <button className={`button is-rounded ${props.styling}`} onClick={props.onClick}>
            {props.add ? (
                <span className="icon">
                    <IoMdAdd/>
                </span>
            ) : null}
            <span>{props.placeholder}</span>
        </button>
    );
}