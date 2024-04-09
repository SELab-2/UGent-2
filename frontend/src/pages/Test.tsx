import {projectGroup} from "../utils/api/Groups.ts";

export default function Test () {
    function clickEvent () {
        console.log(projectGroup(2))
    }

    return (<div>
        <h1>Welcome on this test page, click the button below to test te function</h1>
        <button className={"button is-primary is-large"} onClick={clickEvent}>Click here</button>
    </div>)
}