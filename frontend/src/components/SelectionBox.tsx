import {JSX} from "react";

export function SelectionBox(props: { options: string[] }): JSX.Element {
    return (
        <div className="select is-rounded">
            <select>
                {props.options.map((option) => {
                    return <option key={option}>{option}</option>
                })}
            </select>
        </div>
    );
}