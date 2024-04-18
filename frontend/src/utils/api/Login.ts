import {DEBUG} from "../../pages/root.tsx";
import {Token} from "../ApiInterfaces.ts";

export async function post_ticket(ticket: string): Promise<Token | undefined> {
    let url = '/api/login?ticket=' + ticket;
    if (DEBUG) {
        url = 'http://127.0.0.1:8000/api/login?ticket=' + ticket;
    }

    const tokenData = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (tokenData.ok) {
        return await tokenData.json() as Token
    }

    return undefined
}