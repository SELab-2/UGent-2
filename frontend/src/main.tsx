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
import SubjectsTeacher from "./pages/teacher/SubjectsTeacher.tsx";
import subjectsTeacherLoader, {SUBJECT_TEACHER_ROUTER_ID} from "./dataloaders/SubjectsTeacherLoader.ts";
import loginLoader, {LOGIN_ROUTER_ID} from "./dataloaders/LoginLoader.ts";
import ErrorLogin from "./components/authentication/ErrorLogin.tsx";
import ProjectsViewStudent from "./pages/student/ProjectsViewStudent.tsx";
import CoursesViewStudent from "./pages/student/CoursesViewStudent.tsx";
import RequireAuth from "./components/authentication/RequireAuth.tsx";
import {AuthProvider} from "./components/authentication/AuthProvider.tsx";

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

            <Route element={<RequireAuth allowedRoles={['STUDENT']}/>}>
                <Route id={STUDENT_ROUTER_ID} path={"/student"} element={<HomeStudent/>} loader={studentLoader}/>
                <Route path={"/student/projects"} element={<ProjectsViewStudent/>}/>
                <Route path={"/student/courses"} element={<CoursesViewStudent/>}/>
            </Route>

            <Route element={<RequireAuth allowedRoles={['TEACHER']}/>}>
                <Route id={TEACHER_ROUTER_ID} path={"/teacher"} element={<HomeTeacher/>} loader={teacherLoader}/>
                <Route path={"/teacher/courses"} element={<SubjectsTeacher/>} id={SUBJECT_TEACHER_ROUTER_ID}
                       loader={subjectsTeacherLoader}/>
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
