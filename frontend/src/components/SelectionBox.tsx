import {ChangeEvent, JSX} from "react";
import {StateSetter} from "../types/common.ts";

export function SelectionBox<T>(props: {
    options: string[],
    value: string,
    value_as_number?: boolean,
    setValue: StateSetter<T>
}): JSX.Element {

    function handleChange(e: ChangeEvent<HTMLSelectElement>) {
        if (props.value_as_number) {
            // Ik denk dat de bedoeling was dat T het return type is, maar uiteindelijk is het return type altijd een string.
            // (check met useRef op de hook)
            // Vandaar deze 'hack'.
            props.setValue(Number(e.target.value) as T);
        } else {
            props.setValue(e.target.value as T);
        }
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