import {JSX} from "react";
import "../assets/styles/table.css"
import {Link} from "react-router-dom";
import {TableRow} from "../types/tableRows.ts";

const firstFieldWidth: number = 40;
const otherFieldsWidth = (keysLength: number) => 1 / (keysLength - 1) * 100 - firstFieldWidth / (keysLength - 1);

function TableDataElement<T extends TableRow>(props: {home: string, row: T, colIndex: number, keys: string[], index: number}): JSX.Element {
    const widthElement = props.colIndex == 0 ? firstFieldWidth : otherFieldsWidth(props.keys.length)
    const values: any[] = Object.values(props.row)

    return (
        <td style={{width: `${widthElement}%`, textAlign: props.colIndex == 0 ? "start" : "center"}} key={props.colIndex}>
            { typeof values[props.index] === "object" ? (
                <Link to={`/${props.home}/${Object.keys(props.row)[props.index]}/${values[props.index]["id"]}`}>
                    <a>{values[props.index]["name"]}</a>
                </Link>
            ) : (
                <>{values[props.index]}</>
            )}
        </td>
    )
}

export function Table<T extends TableRow>(props: { title: string, data: T[], ignoreKeys: string[], home: string }): JSX.Element {

    // todo: translate the keys for i18n way
    // right now only the name of the key will be written as it will be completely different with i18n
    const keys = props.data.length > 0 ? Object.keys(props.data[0]) : [];

    return (
        <div className={"is-flex is-flex-direction-column is-align-content-center"}>
            <div className="title-lines">{props.title}</div>
            {keys.length > 0 && <table className={"table is-fullwidth"}>
                <thead>
                <tr>
                    {keys.map((field, index) => (
                        !props.ignoreKeys.some(item => field === item) ?
                            index === 0 ?
                                <th style={{width: `${firstFieldWidth}%`}} key={index}>{field}</th>
                                :
                                <th style={{width: `${otherFieldsWidth(keys.length)}%`, textAlign: "center"}}
                                    key={index}>{field}</th>
                            : <td style={{width: `${otherFieldsWidth(keys.length)}%`}} key={index}></td>
                    ))}
                </tr>
                </thead>
                <tbody>
                {props.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {keys.map((field, colIndex) => (
                            !props.ignoreKeys.some(item => field === item) ?
                                <TableDataElement home={props.home} row={row} colIndex={colIndex} keys={keys} index={keys.indexOf(field)}/>
                                :
                                <td style={{width: `${otherFieldsWidth}%`}} key={colIndex}></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>}
            {keys.length == 0 && <p className={"is-flex is-justify-content-center is-italic pt-5"}>No data yet.</p>}
        </div>
    );
}