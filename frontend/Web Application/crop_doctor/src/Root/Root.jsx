import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";

const Root = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="pt-20 px-4">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Root;
