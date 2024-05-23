import {JSX} from "react";
import '../../assets/styles/admin.css'
import { OperationButton } from "./OperationButton";

export function Person(props: {email: string, operations: OperationButton[]}): JSX.Element {
    return (
        <div className="person">
            <p className="name">{props.email}</p>
            <table className="operations">
                {props.operations.map(operation => (
                    operation
                ))}
            </table>
        </div>
    );
}