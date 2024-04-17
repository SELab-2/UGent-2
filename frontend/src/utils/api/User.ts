import apiFetch from "../ApiFetch.ts";

export function modify_language(language: string): void {
    void apiFetch(`/user?language=${language.toUpperCase()}`, {
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
