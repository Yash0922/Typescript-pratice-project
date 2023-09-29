import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../Components/Pages/LOGIN/Login";
import OTPPage from "../Components/Pages/LOGIN/OTPPage";



const router = createBrowserRouter([
 

  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/otp",
    element: (
      <>
        <OTPPage />
      </>
    ),
  },

    
]);

const AllRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AllRoutes;
