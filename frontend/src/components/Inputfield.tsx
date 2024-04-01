<<<<<<< Updated upstream
import {ChangeEvent, useState} from 'react';

export default function Inputfield(props: { placeholder: string }) {
    const [inputValue, setInputValue] = useState('');

=======
import {ChangeEvent} from 'react';
import {StateSetter} from "../types/common.ts";

export default function Inputfield(props: {
    placeholder?: string,
    value: string,
    setValue: StateSetter<string>
}) {
>>>>>>> Stashed changes
    // Event handler to update the input value
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value);
    }

    return (
        <input
            style={{width: "33%"}}
            className={"input is-rounded"}
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder={props.placeholder}
        />
    );
}

