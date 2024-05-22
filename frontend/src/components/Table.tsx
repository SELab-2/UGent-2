import {JSX} from "react";
import "../assets/styles/table.css"
import {Link} from "react-router-dom";
import {TableRow} from "../types/tableRows.ts";
import {useTranslation} from 'react-i18next';

const firstFieldWidth: number = 40;

function otherFieldsWidth(keysLength: number): number {
    return 1 / (keysLength - 1) * 100 - firstFieldWidth / (keysLength - 1);
}

function TableDataElement<T extends TableRow>(props: {
    home: string,
    row: T,
    colIndex: number,
    keys: string[],
    index: number
}): JSX.Element {
    const widthElement = props.colIndex == 0 ? firstFieldWidth : otherFieldsWidth(props.keys.length)
    const values = Object.values(props.row)

    return (
        <td style={{width: `${widthElement}%`, textAlign: props.colIndex == 0 ? "start" : "center"}}>
            {typeof values[props.index] === "object" && "id" in values[props.index] ? (
                <Link to={`/${props.home}/${Object.keys(props.row)[props.index]}/${(values[props.index] as {
                    name: string,
                    id: number
                }).id}`}>
                    {(values[props.index] as { name: string, id: number }).name}
                </Link>
            ) : (
                <>{values[props.index]}</>
            )}
        </td>
    )
}

const field_string_mapper = new Map<string, string>(Object.entries({
    project: "table.project",
    course: "table.course",
    deadline: "table.deadline",
    status: "table.status",
    numberOfSubmissions: "table.number_of_submissions",
    firstUpcomingDeadline: "table.first_upcoming_deadline",
    name: "table.name",
    email: "table.email",
    numberOfProjects: "table.number_of_projects",
}))

function getField(map: Map<string, string>, key: string): string {
    const value = map.get(key)
    return value !== undefined ? value : key // if key not found in map, use key itself (should not happen)
}

export function Table<T extends TableRow>(props: {
    title: string,
    data: T[],
    ignoreKeys: string[],
    home: string
}): JSX.Element {

    // todo: translate the keys for i18n way
    // right now only the name of the key will be written as it will be completely different with i18n
    const keys = props.data.length > 0 ? Object.keys(props.data[0]) : [];

    const {t} = useTranslation();

    return (
        <div className={"is-flex is-flex-direction-column is-align-content-center"}>
            <div className="title-lines">{props.title}</div>
            {keys.length > 0 && <table className={"table is-fullwidth"}>
                <thead>
                <tr>
                    {keys.map((field, index) => (
                        !props.ignoreKeys.some(item => field === item) ?
                            index === 0 ?
                                <th style={{width: `${firstFieldWidth}%`}}
                                    key={index}>{t(getField(field_string_mapper, field))}</th>
                                :
                                <th style={{width: `${otherFieldsWidth(keys.length)}%`, textAlign: "center"}}
                                    key={index}>{t(getField(field_string_mapper, field))}</th>
                            : <td style={{width: `${otherFieldsWidth(keys.length)}%`}} key={index}></td>
                    ))}
                </tr>
                </thead>
                <tbody>
                {props.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {keys.map((field, colIndex) => (
                            !props.ignoreKeys.some(item => field === item) ?
                                <TableDataElement key={colIndex} home={props.home} row={row} colIndex={colIndex}
                                                  keys={keys} index={keys.indexOf(field)}/>
                                :
                                <td style={{width: `${otherFieldsWidth(keys.length)}%`}} key={colIndex}></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>}
            {keys.length == 0 &&
                <p className={"is-flex is-justify-content-center is-italic pt-5"}>{t('table.no_data_yet')}</p>}
        </div>
    );
}