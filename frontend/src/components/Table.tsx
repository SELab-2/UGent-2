import {JSX} from "react";
import "../assets/styles/table.css"

const TableData: { "Naam": string, "Aantal projecten": number, "Kortste deadline": string }[] = [
    {
        "Naam": "Automaten, berekenbaarheid & complexiteit",
        "Aantal projecten": 3,
        "Kortste deadline": "17:00 - 23/02/2024"
    },
    {
        "Naam": "Computationele Biologie",
        "Aantal projecten": 2,
        "Kortste deadline": "19:00 - 25/02/2024"
    }
];

interface TableRow {
    "Naam": string;
    "Aantal projecten": number;
    "Kortste deadline": string;
}

export function Table(props: { title: string, keys: (keyof TableRow)[] }): JSX.Element {
    return (
        <>
            <div className="title_lines">{props.title}</div>
            <table className={"table is-fullwidth"}>
                <thead>
                <tr>
                    {props.keys.map((field, index) => (
                        <th key={index}>{field}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {TableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {props.keys.map((field, colIndex) => (
                            <td key={colIndex}>{row[field]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </>

    );
}