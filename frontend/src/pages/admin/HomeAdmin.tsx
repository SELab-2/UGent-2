import {JSX} from "react";
import '../../assets/styles/simple_checks.css'
import { useState } from 'react';

export default function HomeAdmin(): JSX.Element {
    
    const [checked, setChecked] = useState<Boolean>(false);

    function handleCheckbox(checkbox: {target: {checked: Boolean}}) {
        setChecked(checkbox.target.checked);
    }

    return (
        <div className="center">
            <div className="content">
                <p className="warning">Bij veranderingen zullen alle indieningen opnieuw gecontroleerd worden.</p>
                <div className="type">
                    <div className="field">
                        <input id="switchRoundedDefault" type="checkbox" onChange={e => handleCheckbox(e)} name="switchRoundedDefault" className="switch is-rounded"/>
                        {checked
                        ? <label htmlFor="switchRoundedDefault">
                            <div className="thin">enkele file</div>
                            <div className="divider">/</div>
                            <div className="thick">zip-bestand</div>
                        </label>
                        : <label htmlFor="switchRoundedDefault">
                            <div className="thick">enkele file</div>
                            <div className="divider">/</div>
                            <div className="thin">zip-bestand</div>
                        </label>
                    }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}