import React from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import './index.css'
import Root from './pages/root.tsx'
import ErrorPage from './pages/error.tsx'
import LoginScreen from "./pages/login/LoginScreen.tsx";
import HomeAdmin from "./pages/admin/HomeAdmin.tsx";
import HomeStudent from "./pages/student/HomeStudent.tsx";
import HomeTeacher from "./pages/teacher/HomeTeacher.tsx";
import 'bulma/css/bulma.min.css';
import './assets/styles/mainpage.css'
import studentLoader from "./dataloaders/StudentLoader.ts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>
    },
    {
        path: "/login",
        element: <LoginScreen/>
    },
    {
        path: "/admin",
        element: <HomeAdmin/>
    },
    {
        path: "/student",
        element: <HomeStudent/>,
        id: "student",
        loader: studentLoader
    },
    {
        path: "/teacher",
        element: <HomeTeacher/>
    }
]);

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
