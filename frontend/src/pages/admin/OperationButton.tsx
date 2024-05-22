import {JSX} from "react";
import '../../assets/styles/admin.css'
import { CgMathPlus } from "react-icons/cg";
import { CgMathMinus } from "react-icons/cg";
import { OperationType } from "../../others/enums";

export type OperationButton = React.ReactElement;

export function OperationButton(props: {type: OperationType, action: () => void}): JSX.Element {
    switch(props.type) {
        case OperationType.ADD:
            return (
                <button className="button is-small is-success">
                    <span className="icon">
                        <CgMathPlus />
                    </span>
                </button>
            );
        case OperationType.REMOVE:
            return (
                <button className="button is-small is-danger">
                    <span className="icon">
                        <CgMathMinus />
                    </span>
                </button>
            );
    }
}