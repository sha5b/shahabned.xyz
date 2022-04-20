const path = require("path");

//Generate Work Pages
module.exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const WorkPage = path.resolve("./src/pages/templates/WorkPage.js");
  const { data } = await graphql(`
    query {
      allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            slug
            id
          }
          next {
            slug
            id
          }
          previous {
            slug
            id
          }
        }
      }
    }
  `);

  const pages = data.allMdx.edges;

  pages.forEach(({ node, next, previous }) => {
    createPage({
      path: `${node.slug}`,
      component: WorkPage,
      context: {
        slug: node.slug,
        id: node.id,
        next,
        previous,
        /*The id from the context menu is parsed into the new created Page to use it as a Query variable */
      },
    });
  });
};
