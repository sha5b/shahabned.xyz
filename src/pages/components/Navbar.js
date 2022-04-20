import React from "react";
import { Link } from "gatsby";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <h1>//shahabnedaei</h1>
        <div>
          <Link to="/">home</Link>
          <Link to="/cv">cv</Link>
          <Link to="/404">error</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
