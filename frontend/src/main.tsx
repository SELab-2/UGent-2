import React from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import './index.css'
import Root from './pages/root.tsx'
import ErrorPage from './pages/error.tsx'
import LoginScreen from "./pages/login/LoginScreen.tsx";
import HomeAdmin from "./pages/admin/HomeAdmin.tsx";
import HomeStudent from "./pages/student/HomeStudent.tsx";
import HomeTeacher from "./pages/teacher/HomeTeacher.tsx";
import studentLoader, {STUDENT_ROUTER_ID} from "./dataloaders/StudentLoader.ts";
import Unauthorized from "./components/authentication/Unauthorized.tsx";
import teacherLoader, {TEACHER_ROUTER_ID} from "./dataloaders/TeacherLoader.ts";
import loginLoader, {LOGIN_ROUTER_ID} from "./dataloaders/LoginLoader.ts";
import ErrorLogin from "./components/authentication/ErrorLogin.tsx";
import ProjectsViewStudent from "./pages/student/ProjectsViewStudent.tsx";
import CoursesViewStudent from "./pages/student/CoursesViewStudent.tsx";
import RequireAuth from "./components/authentication/RequireAuth.tsx";
import {AuthProvider} from "./components/authentication/AuthProvider.tsx";
import 'bulma/css/bulma.min.css';
import './assets/styles/mainpage.css'
import ProjectsViewTeacher from "./pages/teacher/ProjectsViewTeacher.tsx";
import CoursesViewTeacher from "./pages/teacher/CoursesViewTeacher.tsx";
import {CreateProject} from "./pages/teacher/CreateProject.tsx";
import CreateCourse from "./pages/teacher/CreateCourse.tsx";
import ProjectViewStudent from "./pages/student/ProjectViewStudent.tsx";
import ProjectViewTeacher from "./pages/teacher/ProjectViewTeacher.tsx";
import CourseViewStudent from "./pages/student/CourseViewStudent.tsx";
import CourseViewTeacher from "./pages/teacher/CourseViewTeacher.tsx";
import projectsTeacherLoader, {PROJECTS_TEACHER_ROUTER_ID} from "./dataloaders/ProjectsTeacherLoader.ts";
import projectsStudentLoader, {PROJECTS_STUDENT_ROUTER_ID} from "./dataloaders/ProjectsStudentLoader.ts";
import coursesStudentLoader, {COURSES_STUDENT_ROUTER_ID} from './dataloaders/CoursesStudentLoader.ts';
import coursesTeacherLoader, {
    COURSES_TEACHER_ROUTER_ID,
    CREATE_PROJECT_TEACHER_ID
} from "./dataloaders/CoursesTeacherLoader.ts";
import projectStudentLoader, {PROJECT_STUDENT} from "./dataloaders/ProjectStudent.ts";
import projectTeacherLoader, {PROJECT_TEACHER} from "./dataloaders/ProjectTeacher.ts";
import courseTeacherLoader, {COURSE_TEACHER} from "./dataloaders/CourseTeacherLoader.ts";
import courseStudentLoader, {COURSE_STUDENT} from "./dataloaders/CourseStudentLoader.ts";
import {DEBUG} from "./pages/root.tsx";

// import i18n (needs to be bundled ;))
import './i18n';
import adminLoader, {ADMIN_LOADER} from "./dataloaders/AdminLoader.ts";
import JoinCourseScreen from "./pages/student/JoinCourse.tsx";
import joinCourse, {JOIN_COURSE} from "./dataloaders/JoinCourse.ts";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={"/"} errorElement={<ErrorPage/>}>

            {/* Public routes */}
            <Route path={"login"} id={LOGIN_ROUTER_ID} element={<LoginScreen/>} loader={loginLoader}
                   errorElement={<ErrorLogin/>}/>
            <Route path={"unauthorized"} element={<Unauthorized/>}/>

            {/* Protected routes */}
            <Route element={<RequireAuth allowedRoles={['ADMIN', 'STUDENT', 'TEACHER']}/>}>
                <Route path={""} element={<Root/>} errorElement={<ErrorPage/>}/>
            </Route>

            <Route element={<RequireAuth allowedRoles={['ADMIN']}/>}>
                <Route id={ADMIN_LOADER} path={"admin"} element={<HomeAdmin/>} loader={adminLoader}/>
            </Route>

            <Route element={<RequireAuth allowedRoles={['STUDENT']}/>}>
                <Route id={STUDENT_ROUTER_ID} path={"/student"} element={<HomeStudent/>} loader={studentLoader}/>
                <Route id={PROJECTS_STUDENT_ROUTER_ID} path={"/student/projects"} element={<ProjectsViewStudent/>}
                       loader={projectsStudentLoader}/>
                <Route id={PROJECT_STUDENT} path={"/student/project/:id"} element={<ProjectViewStudent/>}
                       loader={({params}) => {
                           return projectStudentLoader(params.id);
                       }}/>
                <Route id={COURSES_STUDENT_ROUTER_ID} path={"/student/courses"} element={<CoursesViewStudent/>}
                       loader={coursesStudentLoader}/>
                <Route id={COURSE_STUDENT} path={"/student/course/:id"} element={<CourseViewStudent/>}
                       loader={({params}) => {
                           return courseStudentLoader(params.id);
                       }}/>
                <Route id={JOIN_COURSE} path={"/student/course/:id/join"} element={<JoinCourseScreen/>}
                       loader={({params}) => {
                           return joinCourse(params.id);
                       }}/>
            </Route>

            <Route element={<RequireAuth allowedRoles={['TEACHER']}/>}>
                <Route id={TEACHER_ROUTER_ID} path={"/teacher"} element={<HomeTeacher/>} loader={teacherLoader}/>
                <Route id={PROJECTS_TEACHER_ROUTER_ID} path={"/teacher/projects"} element={<ProjectsViewTeacher/>}
                       loader={projectsTeacherLoader}/>
                <Route id={PROJECT_TEACHER} path={"/teacher/project/:id"} element={<ProjectViewTeacher/>}
                       loader={({params}) => {
                           return projectTeacherLoader(params.id);
                       }}/>
                <Route id={CREATE_PROJECT_TEACHER_ID} path={"/teacher/projects/create"} element={<CreateProject/>}
                       loader={coursesTeacherLoader}/>
                <Route id={COURSES_TEACHER_ROUTER_ID} path={"/teacher/courses"} element={<CoursesViewTeacher/>}
                       loader={coursesTeacherLoader}/>
                <Route id={COURSE_TEACHER} path={"/teacher/course/:id"} element={<CourseViewTeacher/>}
                       loader={({params}) => {
                           return courseTeacherLoader(params.id);
                       }}/>
                <Route path={"/teacher/courses/create"} element={<CreateCourse/>}/>
            </Route>
        </Route>
    )
)

createRoot(document.getElementById('root')!).render(

    DEBUG ? (
    <React.StrictMode>
        <CreateRootHelper/>
    </React.StrictMode>
    ) : (
        <CreateRootHelper/>
    )
)

export function CreateRootHelper(): JSX.Element {
    return (
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    )
}
