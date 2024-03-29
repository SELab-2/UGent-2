import {JSX} from "react";
import "../assets/styles/table.css"

export interface TableRow {
    name: string
}

export interface TableRowProjects extends TableRow {
    course: string,
    deadline: string | null,
    status: string | null,                      // for student
    numberOfSubmissions: number | null          // for teacher and only for visible projects
}

export interface TableRowCourses extends TableRow {
    numberOfProjects: number | null;            // not for archived projects for teachers
    shortestDeadline: string | null;            // only if not archived
}

export function Table<T extends TableRow>(props: { title: string, data: T[], ignoreKeys: string[] }): JSX.Element {

    // todo: translate the keys for i18n way
    // right now only the name of the key will be written as it will be completely different with i18n
    const keys = props.data.length > 0 ? Object.keys(props.data[0]) : [];
    const firstFieldWidth: number = 40;
    const otherFieldsWidth: number = 1 / (keys.length - 1) * 100 - firstFieldWidth / (keys.length - 1);

    return (
        <div className={"is-flex is-flex-direction-column is-align-content-center"}>
            <div className="title-lines">{props.title}</div>
            {keys.length > 0 && <table className={"table is-fullwidth"}>
                <thead>
                <tr>
                    {keys.map((field, index) => (
                        !props.ignoreKeys.some(item => field === item) ?
                            field === "name" ?
                                <th style={{width: `${firstFieldWidth}%`}} key={index}>{field}</th>
                                :
                                <th style={{width: `${otherFieldsWidth}%`, textAlign: "center"}}
                                    key={index}>{field}</th>
                            : <td style={{minWidth: `${otherFieldsWidth}%`}}></td>
                    ))}
                </tr>
                </thead>
                <tbody>
                {props.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {keys.map((field, colIndex) => (
                            !props.ignoreKeys.some(item => field === item) ?
                                colIndex == 0 ?
                                    <td style={{width: `${firstFieldWidth}%`}}
                                        key={colIndex}>{Object.values(row)[keys.indexOf(field)]}</td>
                                    :
                                    <td style={{width: `${otherFieldsWidth}%`, textAlign: "center"}}
                                        key={colIndex}>{Object.values(row)[keys.indexOf(field)]}</td>
                                : <td style={{minWidth: `${otherFieldsWidth}%`}}></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>}
            {keys.length == 0 && <p className={"is-flex is-justify-content-center is-italic pt-5"}>No data yet.</p>}
        </div>
    );
}