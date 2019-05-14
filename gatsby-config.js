const path = require("path");

module.exports = {
  siteMetadata: {
    title: "Resume Makr"
  },

  plugins: [
    "gatsby-plugin-typescript",

    {
      resolve: "gatsby-plugin-alias-imports",
      options: {
        alias: {
          "../../theme.config": path.resolve(
            "src/styles/semantic-theme/theme.config"
          )
        },
        extensions: []
      }
    },

    {
      resolve: "gatsby-source-filesystem",

      options: {
        name: "images",

        path: path.join(__dirname, "src", "images")
      }
    },

    "gatsby-plugin-sharp",

    "gatsby-transformer-sharp",

    {
      resolve: "gatsby-plugin-env-variables",

      options: {
        whitelist: ["API_URL"]
      }
    },

    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Resume For Job Success",
        short_name: "ResumeMakr",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#31383F",
        // Enables "Add to Home screen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: "standalone",
        icon: "src/images/logo.png" // This path is relative to the root of the site.
      }
    },

    "gatsby-plugin-offline",

    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Enables Google Optimize using your container Id
        optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
        // Enables Google Optimize Experiment ID
        experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
        // Set Variation ID. 0 for original 1,2,3....
        variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
        // Any additional create only fields (optional)
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: "example.com"
      }
    },

    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    },

    "gatsby-plugin-sass",

    "gatsby-plugin-less",

    "gatsby-plugin-netlify"
  ]
};
