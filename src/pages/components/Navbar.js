import React from "react";
import { Link } from "gatsby";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <h4>
          <Link to="/cv">cv</Link>{''} // {''}
          <Link to="/">home</Link>{''} // {''}
          <Link to="/about">about</Link>{''}
        </h4>
      </div>
    </>
  );
};

export default Navbar;
