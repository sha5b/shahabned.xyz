import React from "react";
import Layout from "./components/Layout";
import ImageGallery from "./components/ImageGallery";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

const Home = ({ data, nextUrl, previousUrl }) => {
  return (
    <Layout nextUrl="/cv" previousUrl="/about">
      <GatsbySeo
        title="Shahab Nedaei Portfolio"
        description="Digital and Internet Art - Portfolio of Shahab Nedaei"
        canonical="https://shahabned.xyz/"
        openGraph={{
          url: "https://shahabned.xyz/",
          title: "Shahab Nedaei Portfolio",
          description: "Digital and Internet Art - Portfolio of Shahab Nedaei",
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
      <ImageGallery />
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

export default Home;
