import {JSX} from "react";
import {IoMdAdd} from "react-icons/io";

export function RegularButton(props: { placeholder: string, add: boolean, onClick: () => void }): JSX.Element {
    return (
        <button className="button is-rounded" onClick={props.onClick}>
            {props.add ? (
                <span className="icon">
                    <IoMdAdd/>
                </span>
            ) : null}
            <span>{props.placeholder}</span>
        </button>
    );
}