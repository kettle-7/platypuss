/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `(Beta!) Platypuss`,
    description: `New changes to Platypuss go here before they're pushed to production.`,
    image: `/icon.png`,
    siteUrl: `https://beta.platypuss.net`,
  },
  plugins: ["gatsby-plugin-sass", {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/images/icon.png"
    }
  }, "gatsby-plugin-mdx", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "pages",
      "path": "./src/pages/"
    },
    __key: "pages"
  }]
};