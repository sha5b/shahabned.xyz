import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  1920: 3,
  1024: 2,
  640: 1,
};

const ImageGallery = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            id
            slug
            frontmatter {
              title
              medium
              date
              featuredImage {
                childImageSharp {
                  gatsbyImageData(
                    formats: AUTO
                    layout: FULL_WIDTH
                    placeholder: DOMINANT_COLOR
                    quality: 90
                  )
                }
              }
            }
          }
        }
      }
    }
  `);

  return (
    <>
      <Masonry breakpointCols={breakpointColumnsObj} className="imagegrid">
        {data.allMdx.edges.map((edge) => {
          const featuredImage = getImage(edge.node.frontmatter.featuredImage);
          return (
            <>
              <div className="imagegrid-item">
                <Link to={`/${edge.node.slug}`}>
                  <GatsbyImage
                    className="imagegrid-item-image"
                    image={featuredImage}
                    alt=""
                  />
                  <div className="imagegrid-item-text">
                    <h3>{edge.node.frontmatter.title}</h3>
                    <p>
                      {edge.node.frontmatter.date} //{" "}
                      {edge.node.frontmatter.medium}
                    </p>
                  </div>
                </Link>
              </div>
            </>
          );
        })}
      </Masonry>
    </>
  );
};

export default ImageGallery;
