import React from "react";
import Footer from "./Footer";

//Styles
import "../styles/main.scss";

const Layout = ({ children, nextUrl, previousUrl }) => {
  return (
    <>
      {children}
      <Footer next={nextUrl} previous={previousUrl} />
    </>
  );
};

export default Layout;
