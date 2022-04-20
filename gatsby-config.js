module.exports = {
  siteMetadata: {
    title: "Shahabverse",
    description: "Digital and Internet Art - Portfolio of Shahab Nedaei",
    author: "@shahabnedaei",
    keywords:
      "shahab, nedaei, art, internet, internet art, digital, digital painting, video, video art, post-processing, generative, generative art, genart, meme, meme art, portfolio, art portfolio, scuplture, digital scuplture, generative scuplture, kinetic, kinetic scuplture, robotic, robotic art, arduino, vr, virtual, reality, virtual reality, virtaul reality installation, virtual reality art games, games,prints, print art, installations, installation art, exhibition, exhibition curation, curation, virtual exhibitions, digital exhibitions, virtual, virtual art, render, rendering, render art, blender, blender art, architecture, architecture art, living art, bio art, simulation, simulation art, photo, photography, photo art, photography art, university, university of applied Arts, Angewandte, universität für angewandte kunst, ruth schnell",
    siteUrl: "https://shahabned.xyz",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-next-seo",
      options: {
        type: "website",
        titleTemplate: "Shahabverse | %s",
        firstName: "Shahab",
        lastName: "Nedaei",
        gender: "robot",
        locale: "de_AT",
        url: "https://shahabned.xyz/",
        site_name: "Shahabverse",
        description: "Digital and Internet Art - Portfolio of Shahab Nedaei",
        canonical: "https://shahabned.xyz/",
        language: "en",
      },
    },
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-remark-images",
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", "md"],
      },
      gatsbyRemarkPlugins: [
        {
          resolve: "gatsby-remark-images",
          options: {},
        },
      ],
      plugin: [
        "gatsby-remark-relative-images",
        {
          resolve: `gatsby-remark-images`,
          options: {},
        },
      ],
    },
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "works",
        path: `${__dirname}/src/projects/`,
      },
      __key: "works",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/gatsby-config.js`,
      },
    },
    {
      resolve: "gatsby-plugin-sharp",
      option: {
        default: {
          formats: ["auto", "webp"],
          placeholder: "dominantColor",
          qulaity: 100,
        },
      },
    },
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Shahabverse",
        short_name: "shahabned.xyz",
        start_url: "/",
        background_color: "#F5F5F5",
        icon: "./src/pages/icons/favicon.png",
        display: "standalone",
      },
    },
  ],
};
