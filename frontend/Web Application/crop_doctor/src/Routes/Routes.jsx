import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Root from "../Root/Root";
import Home from "../Pages/Home";
import CropDetectionPage from "../Pages/CropDetectionPage";
import DiseaseLibrary from "../Pages/DiseaseLibrary";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import PrivateRoute from "../Components/PrivateRoute";
import Dashboard from "../Pages/Dashboard";
import HistoryPage from "../Pages/HistoryPage";





export const router = createBrowserRouter([
  {
    path: "/",
    Component:Root,
    children:[
      {
        path:"/",
        Component:Home
      },
      {
        path:"/detect",
        Component:CropDetectionPage
      },
      {
        path:"/diseases",
        Component: () =>(
          <PrivateRoute>
            <DiseaseLibrary/>
          </PrivateRoute>
        )
      },
      {
  path: "/dashboard",
  Component: () => (
    <PrivateRoute>
      <Dashboard/>
    </PrivateRoute>
  )
},
      {
  path: "/detection-history",
  Component: () => (
    <PrivateRoute>
      <HistoryPage/>
    </PrivateRoute>
  )
},
      {
        path:"/signup",
        Component:Signup
      },
      {
        path:"/login",
        Component:Login
      }
      
    ]
  },
]);