import {JSX} from "react";
import FieldWithLabel from "./FieldWithLabel.tsx";
import {FaCheck, FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";

export default function ViewProjectStudent(): JSX.Element {
    return (
        <>
            <FieldWithLabel fieldLabel={"Naam"} fieldBody={"Markov Decision Making"} arrow={true}></FieldWithLabel>
            <FieldWithLabel fieldLabel={"Vak"} fieldBody={"Automaten, berekenbaarheid en complexiteit"}
                            arrow={true}></FieldWithLabel>
            <FieldWithLabel fieldLabel={"Deadline"} fieldBody={"17:00 - 23/02/2024"} arrow={true}></FieldWithLabel>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{"> "}Status: </label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <label className={"has-text-danger"}>Failed</label>
                    </div>
                </div>
            </div>
            <FieldWithLabel fieldLabel={"Beschrijving"}
                            fieldBody={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel arcu sit amet quam scelerisque vestibulum. Nulla lectus ipsum, convallis ut odio sit amet, auctor dictum felis. Phasellus libero sapien, tempus eu fringilla eu, facilisis vel purus. Quisque odio elit, viverra id tortor eu, blandit luctus turpis. Vestibulum libero felis, condimentum finibus posuere sed, lobortis non tellus. Phasellus laoreet, metus a semper vulputate, mi dui lobortis augue, quis fringilla ipsum felis eu mauris. Donec sem dolor, porta ultrices venenatis eget, ullamcorper id turpis. Nulla quis lacinia sapien. Mauris dignissim nisi id quam vulputate molestie. Fusce eleifend sagittis dolor sit amet aliquam. Aenean in sapien diam. Donec iaculis nunc eu enim pulvinar ultricies. Suspendisse potenti. Etiam quis viverra nunc. Nulla tempus in erat vitae tincidunt. Vestibulum et iaculis nulla. "}
                            arrow={false}></FieldWithLabel>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Indiening moet bevatten:</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <li>Diagram.dgr</li>
                        <li>verslag.pdf</li>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Groepsleden(3/4): </label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <table className={"table is-fullwidth"}>
                            <thead>
                            <tr>
                                <th>Naam</th>
                                <th>Email</th>
                                <th>Laatste indiening</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Jan</td>
                                <td>jan@ugent.be</td>
                                <td> -</td>
                            </tr>
                            <tr>
                                <td>Peter</td>
                                <td>peter@ugent.be</td>
                                <td> -</td>
                            </tr>
                            <tr>
                                <td>Erik</td>
                                <td>erik@ugent.be</td>
                                <td><FaCheck/></td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Indiening(zip)</label>
                </div>
                <div className="field-body">
                    <div className="field">

                        <li className={"mb-3"}>
                            <label className={"mr-3"}>My_files.zip </label>
                            <button className="button">
                                <FaDownload/>
                            </button>
                        </li>
                        <li>
                            <div className="field is-horizontal">
                                <div className="field-label">
                                    <label className="file-label">
                                        <input className="file-input" type="file" name="resume"/>
                                        <span className="file-cta">
                                        <span className="file-icon">
                                            <FaUpload/>
                                        </span>
                                            <span className="file-label">
                                                Kies een bestand
                                            </span>
                                    </span>
                                        <span className="file-name">
                                        This_is_the_file.zip
                                    </span>
                                    </label>
                                </div>
                                <div className="field-body">
                                    <button className="button">
                                        <FaDownload/>
                                    </button>
                                </div>

                            </div>
                        </li>
                    </div>
                </div>
            </div>
            <div className="columns is-mobile is-centered">
                <div className="column is-half">
                    <button className="button is-medium is-center" style={{backgroundColor: "#9c9afd"}}>Bevestigen
                    </button>
                </div>

            </div>
        </>
    );
}