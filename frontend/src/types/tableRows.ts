export interface TableRow {
}


export interface TableRowProjects extends TableRow {
    project: {
        name: string,
        id: number,
    }
    course: {
        name: string,
        id: number,
    }
    deadline: string | Date | null,
    status: string | null,                      // for student
    numberOfSubmissions: number | null          // for teacher and only for visible projects
}

export interface TableRowOverviewProjects extends TableRow {
    project: {
        name: string,
        id: number,
    },
    deadline: string | null,
    status: string | null,                      // for student
}

export interface TableRowCourses extends TableRow {
    course: {
        name: string,
        id: number
    }
    numberOfProjects: number | null;            // not for archived projects for teachers
    firstUpcomingDeadline: Date | string | null;            // only null if archived
}

export interface TableRowPeople extends TableRow {
    name: string,
    email: string
}