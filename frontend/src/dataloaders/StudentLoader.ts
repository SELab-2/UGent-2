import authenticatedApiFetch from "../utils/AuthenticatedApiFetch.ts";
import {Project, Subject} from "../utils/ApiInterfaces.ts";
import {useEffect, useState} from "react";
import useAuth from "../hooks/useAuth.ts";

export interface studentLoaderObject {
    projects?: Project[]
}

const StudentLoader = (): studentLoaderObject => {
    const {token} = useAuth()
    const [projects, setProjects] = useState<Project[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        async function fetchProjects() {
            await authenticatedApiFetch("/api/student/projects", token)
                .then(async response => await response.json() as Project[])
                .then(projects => setProjects(projects));
        }

        if (token) {
            void fetchProjects()
        }

    }, [token]);

    useEffect(() => {
        async function fetchSubjects() {
            await authenticatedApiFetch("/api/student/subjects", token)
                .then(async response => await response.json() as Subject[])
                .then(subjects => setSubjects(subjects));
        }
        if (token){
            void fetchSubjects()
        }

    }, [token]);

    for (let i = 0; i < projects.length; i++) {
        const subject: Subject | undefined = subjects.find(subject => subject.id === projects[i].subject_id);
        if (subject !== undefined) {
            projects[i].subject_name = subject.name;
        }
    }
    // TODO: add submission data
    return {projects};
}

export default StudentLoader