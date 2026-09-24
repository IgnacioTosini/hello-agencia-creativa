"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./_app-toaster.scss";

export const AppToaster = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={3500}
    closeOnClick
    pauseOnFocusLoss
    pauseOnHover
    newestOnTop
    theme="light"
    toastClassName="helloToast"
    progressClassName="helloToastProgress"
  />
);
