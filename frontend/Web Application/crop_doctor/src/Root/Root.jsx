import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Root = () => {
  return (
    <div>
    <ToastContainer position="top-right" autoClose={3000} />
      <Navbar></Navbar>
      <div className="pt-16">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Root;
