import apiFetch from "../ApiFetch.ts";
import i18n from "../../i18n.tsx";
import setLanguage from "../SetLanguage.ts";

export function modify_language(language: string): void {
    void i18n.changeLanguage(language);
    setLanguage(language);
    void apiFetch(`/user?language=${language.toLowerCase()}`, {
        method: 'PUT'
    });
}

export function modify_roles(userId: number, roles: string[]): void {
    console.log(JSON.stringify(roles))
    void apiFetch(`/users/${userId}?roles=${JSON.stringify({roles})}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(roles)
    });
}
