import {parse_id_and_get_item} from "./SharedFunctions.ts";
import {CompleteProject} from "../../utils/ApiInterfaces.ts";


export interface ProjectRoleLoaderObject<T extends CompleteProject> {
    project?: T
}

export default async function projectRoleLoader<T extends CompleteProject>(
    projectsLoader: (filter_on_current: boolean, id: number) => Promise<T[]>,
    project_id: string | undefined,
    filter_on_current: boolean = false
): Promise<ProjectRoleLoaderObject<T>> {
    return {
        project: await parse_id_and_get_item(
            project_id,
            (id) => projectsLoader(filter_on_current, id)
        )
    };
}