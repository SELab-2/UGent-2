import {JSX} from "react";
import {IoMdAdd} from "react-icons/io";

export function RegularButton(props: { placeholder: string, add: boolean, onClick: () => void, styling?: string, disabled?: boolean, primary?: boolean}): JSX.Element {
    return (
        <button className={`button is-rounded ${props.styling} ${props.primary ? "is-primary" : ""}`} onClick={props.onClick} disabled={props.disabled}>
            {props.add ? (
                <span className="icon">
                    <IoMdAdd/>
                </span>
            ) : null}
            <span>{props.placeholder}</span>
        </button>
    );
}