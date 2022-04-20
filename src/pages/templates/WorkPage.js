import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Masonry from "react-masonry-css";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Helmet } from "react-helmet";

const breakpointColumnsObj = {
  default: 3,
  1920: 2,
  1024: 1,
  640: 1,
};

const WorkPage = ({ data, pageContext }) => {
  const { next, previous, slug } = pageContext;
  return (
    <Layout
      nextUrl={(next && `/${next.slug}`) || "/"}
      previousUrl={(previous && `/${previous.slug}`) || "/"}
    >
      <GatsbySeo
        titleTemplate="Shahabverse | %s"
        title={`${data.mdx.frontmatter.title}`}
        description={`${data.mdx.frontmatter.medium}`}
        canonical={`https://shahabned.xyz/${slug}`}
        openGraph={{
          url: `https://shahabned.xyz/${slug}`,
          title: `${data.mdx.frontmatter.title}`,
          description: `${data.mdx.frontmatter.medium}`,
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
      <Masonry breakpointCols={breakpointColumnsObj} className="pagegrid">
        <div className="pagegrid-item">
          <div className="pagegrid-item-header">
            <Link to="/">
              <h1>{data.mdx.frontmatter.title}</h1>
            </Link>
          </div>
          <div className="pagegrid-item-text">
            <MDXRenderer>{data.mdx.body}</MDXRenderer>
          </div>
        </div>
        {data.allFile.edges.map((edge) => {
          const image = getImage(edge.node);
          return (
            <div className="pagegrid-item-image">
              <GatsbyImage image={image} alt="Image of the Project" />
            </div>
          );
        })}
      </Masonry>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String, $slug: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date
        medium
        material
        dimensions
        featuredImage {
          childImageSharp {
            gatsbyImageData(
              formats: AUTO
              layout: FULL_WIDTH
              transformOptions: { cropFocus: ENTROPY }
              placeholder: DOMINANT_COLOR
              quality: 100
            )
          }
        }
      }
      body
    }
    allFile(
      filter: {
        relativeDirectory: { regex: $slug }
        extension: { regex: "/(jpg)|(png)|(jpeg)|(JPG)/" }
      }
    ) {
      edges {
        node {
          base
          relativeDirectory
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
    site {
      siteMetadata {
        keywords
      }
    }
  }
`;

export default WorkPage;
