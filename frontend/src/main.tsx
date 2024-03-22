import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'
import 'bulma/css/bulma.min.css';
import './assets/styles/mainpage.css'
import {AuthProvider} from "./components/authentication/AuthProvider.tsx";
import Root from "./pages/root.tsx";
import LoginScreen from "./pages/login/LoginScreen.tsx";
import RequireAuth from "./components/authentication/RequireAuth.tsx";
import HomeAdmin from "./pages/admin/HomeAdmin.tsx";
import HomeStudent from "./pages/student/HomeStudent.tsx";
import HomeTeacher from "./pages/teacher/HomeTeacher.tsx";
import ErrorPage from "./pages/error.tsx";
import studentLoader from "./dataloaders/StudentLoader.ts";
import Unauthorized from "./components/authentication/Unauthorized.tsx";

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path={"/login"} element={<LoginScreen/>}/>
                    <Route path={"/unauthorized"} element={<Unauthorized/>}/>

                    {/* Protected routes */}
                    <Route element={<RequireAuth allowedRoles={['ADMIN', 'STUDENT', 'TEACHER']}/>}>
                        <Route path={"/"} element={<Root/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedRoles={['ADMIN']}/>}>
                        <Route path={"admin"} element={<HomeAdmin/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedRoles={['STUDENT']}/>}>
                        <Route path={"student"} element={<HomeStudent/>} loader={studentLoader}/>
                    </Route>

                    <Route element={<RequireAuth allowedRoles={['TEACHER']}/>}>
                        <Route path={"teacher"} element={<HomeTeacher/>}/>
                    </Route>

                    <Route path={"*"} element={<ErrorPage/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
