import React from "react";
import Layout from "./components/Layout";

const Error = () => {
  return (
    <Layout>
      <div className="error">404</div>
      <div className="error-subtext">
        <div>The princess you're looking for is in another castle!</div>
        <div>🐢</div>
      </div>
    </Layout>
  );
};

export default Error;
