import {JSX} from "react";

export default function FieldWithLabel(props: { fieldLabel: string, fieldBody: string, arrow: boolean }): JSX.Element {
    return (
        <div className="field is-horizontal">
            <div className="field-label">
                <label className="label">{props.arrow && "> "} {props.fieldLabel}: </label>
            </div>
            <div className="field-body field">
                <label>{props.fieldBody}</label>
            </div>
        </div>
    );
}