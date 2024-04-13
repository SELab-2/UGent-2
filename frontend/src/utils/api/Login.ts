import {DEBUG} from "../../pages/root.tsx";
import {Token} from "../ApiInterfaces.ts";

export async function post_ticket(ticket: string): Promise<Token>{
    let url = '/api/login?ticket=' + ticket;
    if (DEBUG) {
        url = 'http://127.0.0.1:8000/api/login?ticket=' + ticket;
    }

    return await (await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },}))
        .json() as Token;
}