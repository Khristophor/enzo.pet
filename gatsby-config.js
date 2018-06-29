module.exports = {
  siteMetadata: {
    url: `https://trackerandcasey.pet`,
    title: `The sweetest boys`,
    description: `A website to show off pictures of the sweet cats Tracker and Casey`,
    twitter: `@khristophor`
  },
  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/*': [`Cache-Control: max-age=31536000`],
          '/*.html': [`Cache-Control: max-age=0, must-revalidate, public`]
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/images/`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-77905615-2'
      }
    }
  ]
};
