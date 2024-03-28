// import React from "react";

//export type CourseTeacher = {
//}

export type CourseStudent = {
    activeCourses: {
        courseId: string,
        courseName: string,
        activeProjects: number,
        shortestDeadline: string
    }[],
    archivedCourse: {
        course_id: string,
        courseName: string,
        numberOfProjects: number,
        date: string
    }[]
}
