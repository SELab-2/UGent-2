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
// import coursesTeacherLoader, {SUBJECT_TEACHER_ROUTER_ID} from "./dataloaders/CoursesTeacherLoader.ts";
import loginLoader, {LOGIN_ROUTER_ID} from "./dataloaders/LoginLoader.tsx";
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
import projectsTeacherLoader, {PROJECTS_TEACHER_ROUTER_ID} from "./dataloaders/projectsTeacherLoader.ts";
import projectsStudentLoader, {PROJECTS_STUDENT_ROUTER_ID} from "./dataloaders/ProjectsStudentLoader.ts";
import coursesStudentLoader, {COURSES_STUDENT_ROUTER_ID} from './dataloaders/CoursesStudentLoader.ts';
import coursesTeacherLoader, {COURSES_TEACHER_ROUTER_ID} from "./dataloaders/CoursesTeacherLoader.ts";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={"/"}>
            {/* Public routes */}
            <Route path={"login"} id={LOGIN_ROUTER_ID} element={<LoginScreen/>} loader={loginLoader}
                   errorElement={<ErrorLogin/>}/>
            <Route path={"unauthorized"} element={<Unauthorized/>}/>

            {/* Protected routes */}
            <Route element={<RequireAuth allowedRoles={['ADMIN', 'STUDENT', 'TEACHER']}/>}>
                <Route path={""} element={<Root/>} errorElement={<ErrorPage/>}/>
            </Route>

            <Route element={<RequireAuth allowedRoles={['ADMIN']}/>}>
                <Route path={"admin"} element={<HomeAdmin/>}/>
            </Route>

            <Route path={'/student'} element={<RequireAuth allowedRoles={['STUDENT']}/>}>
                <Route id={STUDENT_ROUTER_ID} path={"/student"} element={<HomeStudent/>} loader={studentLoader}/>
                <Route id={PROJECTS_STUDENT_ROUTER_ID} path={"/student/projects"} element={<ProjectsViewStudent/>}
                       loader={projectsStudentLoader}/>
                <Route id={COURSES_STUDENT_ROUTER_ID} path={"/student/courses"} element={<CoursesViewStudent/>}
                       loader={coursesStudentLoader}/>
            </Route>

            <Route element={<RequireAuth allowedRoles={['TEACHER']}/>}>
                <Route id={TEACHER_ROUTER_ID} path={"/teacher"} element={<HomeTeacher/>} loader={teacherLoader}/>
                <Route id={PROJECTS_TEACHER_ROUTER_ID} path={"/teacher/projects"} element={<ProjectsViewTeacher/>}
                       loader={projectsTeacherLoader}/>
                <Route path={"/teacher/projects/create"} element={<CreateProject/>}/>
                <Route id={COURSES_TEACHER_ROUTER_ID} path={"/teacher/courses"} element={
                    <CoursesViewTeacher/>} loader={coursesTeacherLoader}/>
                <Route path={"/teacher/courses/create"} element={<CreateCourse/>}/>
            </Route>
        </Route>
    )
)

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </React.StrictMode>,
)
