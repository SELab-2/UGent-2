import {Language} from "../../components/Settings.tsx";
import apiFetch from "../ApiFetch.ts";

export function modify_language(language: Language): void{
    void apiFetch(`/user?language=${language}`, {
        method: 'PATCH'
    });
}