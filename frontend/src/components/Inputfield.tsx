import {ChangeEvent} from 'react';
import {StateSetter} from "../types/common.ts";

export default function Inputfield(props: {
    placeholder?: string,
    value: string,
    setValue: StateSetter<string>
}) {
    // Event handler to update the input value
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
    }

    return (
        <input
            style={{width: "33%"}}
            className={"input is-rounded"}
            type="text"
            value={props.value}
            onChange={handleChange}
            placeholder={props.placeholder}
        />
    );
}

