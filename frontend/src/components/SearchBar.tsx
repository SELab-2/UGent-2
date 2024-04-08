import {JSX} from "react";
import { FaSearch } from "react-icons/fa";

export function SearchBar(props: {placeholder: string}): JSX.Element {
    return (
    <div className={"field search-field my-5"}>
        <p className={"control has-icons-left"}>
            <input className={"input is-rounded"} type="text" placeholder={props.placeholder}/>
            <span className={"icon is-small is-left"}>
                <FaSearch/>
            </span>
        </p>
    </div>
    );
}