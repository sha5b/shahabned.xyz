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
        <div>Shahab Nedaei works as a digital artist in Vienna. In his projects he examines the meaning and impact on new technology in the post-digital age. Using a variety of technical disciplines, such as VR, A.I., robotics, kinetic and generative sculpture, image manipulation, render and video he fosters the expansion and fluidity of media itself: his work subjects the neverending process of change and challenges the idea of the static. Born 1988 in Tehran, Shahab Nedaei has studied Digital Arts at the University of Applied Arts in Vienna. He works as well as a curator and programmer. </div>
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
