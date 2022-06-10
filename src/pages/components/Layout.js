import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

//Styles
import "../styles/main.scss";

const Layout = ({ children, nextUrl, previousUrl }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer next={nextUrl} previous={previousUrl} />
    </>
  );
};

export default Layout;
