import React from "react";

import { Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "../views/Dashboard";
import NotFound from "../views/NotFound";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export function Routers() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default Routers;
