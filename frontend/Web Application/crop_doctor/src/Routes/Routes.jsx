import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "../Root/Root";
import Home from "../Pages/Home";
import CropDetectionPage from "../Pages/CropDetectionPage";
import DiseaseLibrary from "../Pages/DiseaseLibrary";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import PrivateRoute from "../Components/PrivateRoute";
import Dashboard from "../Pages/Dashboard";
import HistoryPage from "../Pages/HistoryPage";
import Profile from "../Components/Profile";
import UpdateProfile from "../Components/UpdateProfile";
import ChangePassword from "../Components/ChnagePassword";
import AboutPage from "../Pages/AboutPage";
import NotFoundPage from "../Pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/detect",
        Component: CropDetectionPage,
      },
      {
        path: "/diseases",
        Component: () => (
          <PrivateRoute>
            <DiseaseLibrary />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        Component: () => (
          <PrivateRoute>
            <Dashboard />  
          </PrivateRoute>
        ),
        children: [
          {
            index: true, 
            Component:Profile, 
          },
          {
            path: "profile",
            Component: Profile,
          },
          {
            path: "update-profile",
            Component: UpdateProfile,
          },
          {
            path: "detection-history",
            Component: HistoryPage,
          },
          {
            path:"change-password",
            Component: ChangePassword
          }
        ],
      },
      {
        path: "/signup",
        Component: Signup,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/about",
        Component: AboutPage
      },
        {
        path: "*",
        Component: NotFoundPage,
      },

    ],
  },
]);

