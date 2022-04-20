import React from "react";
import Layout from "./components/Layout";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { GatsbySeo } from "gatsby-plugin-next-seo";

const About = ({ data }) => {
  return (
    <Layout nextUrl="/" previousUrl="/cv">
      <GatsbySeo
        title="Shahab Nedaei About"
        description="Digital and Internet Art - About Shahab Nedaei"
        canonical="https://shahabned.xyz/about"
        openGraph={{
          url: "https://shahabned.xyz/about",
          title: "Shahab Nedaei About",
          description: "Digital and Internet Art - About Shahab Nedaei",
        }}
      />
      <Helmet
        meta={[
          {
            name: "keywords",
            content: data.site.siteMetadata.keywords,
          },
        ]}
      />
      <div className="about-subtext">
        <div>The princess you're looking for is in another castle!</div>
        <div>🐢</div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    site {
      siteMetadata {
        keywords
      }
    }
  }
`;

export default About;
