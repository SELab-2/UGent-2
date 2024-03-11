import {ChangeEvent, useState} from 'react';

export default function Inputfield(props: { placeholder: string }) {
    const [inputValue, setInputValue] = useState('');

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

