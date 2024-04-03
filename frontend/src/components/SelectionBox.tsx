import React, {ChangeEvent, JSX} from "react";

export function SelectionBox(props: {
    options: string[],
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
}): JSX.Element {

    function handleChange(e: ChangeEvent<HTMLSelectElement>) {
        props.setValue(e.target.value);
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