import {ChangeEvent, JSX} from "react";
import {StateSetter} from "../types/common.ts";

export function SelectionBox<T>(props: {
    options: string[],
    value: string,
    setValue: StateSetter<T>
}): JSX.Element {

    function handleChange(e: ChangeEvent<HTMLSelectElement>) {
        props.setValue(e.target.value as T);
    }

    return (
        <div className="select is-rounded">
            <select value={props.value} onChange={handleChange}>
                {props.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}