import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';

import './style.css';

export default class extends React.Component {
  state = {
    imageIndex: 0,
    firstImageLoaded: false
  };

  componentDidMount() {
    // preload images
    this.props.data.images.edges.forEach((edge, i) => {
      let image = new Image();
      image.src = edge.node.childImageSharp.resize.src;

      // once the first images is loaded set a flag to fade it in
      if (i === 0) {
        image.onload = () => {
          this.setState({ firstImageLoaded: true });
        };
      }
    });

    document.addEventListener('keydown', this.handleKeyDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  handleKeyDown = event => {
    switch (event.key) {
      case 'a':
      case 'ArrowLeft':
        return this.nextImage(-1);
      case 'Enter':
      case ' ':
      case 'd':
      case 'ArrowRight':
        return this.nextImage(1);
      default:
        return;
    }
  };

  nextImage = (delta = 1) => {
    this.setState(prevState => {
      const next = prevState.imageIndex + delta;
      const lastImage = this.props.data.images.edges.length - 1;
      let imageIndex;

      if (delta > 0) {
        imageIndex = next > lastImage ? 0 : next;
      } else {
        imageIndex = next < 0 ? lastImage : next;
      }

      return { imageIndex };
    });
  };

  currentImage = () =>
    this.props.data.images.edges[this.state.imageIndex].node.childImageSharp
      .resize;

  renderHead = () => {
    const {
      site: { siteMetadata }
    } = this.props.data;

    return (
      <Helmet>
        <title>{siteMetadata.title}</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link key="icon" rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="description" content={siteMetadata.description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={siteMetadata.twitter} />
        <meta name="twitter:creator" content={siteMetadata.twitter} />
        <meta property="og:url" content={siteMetadata.url} />
        <meta property="og:title" content={siteMetadata.title} />
        <meta property="og:description" content={siteMetadata.description} />
        <meta
          property="og:image"
          content={`${siteMetadata.url}${this.currentImage().src}`}
        />
      </Helmet>
    );
  };

  render() {
    const image = this.currentImage();

    return (
      <div className="wrapper" onClick={() => this.nextImage()}>
        {this.renderHead()}
        <div
          className="background"
          style={{ backgroundImage: `url(${image.src})` }}
        />
        <img
          src={image.src}
          alt="Sweet cat being sweet"
          style={{ opacity: this.state.firstImageLoaded ? 1 : 0 }}
        />
      </div>
    );
  }
}

export const PageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        url
        title
        description
        twitter
      }
    }
    images: allFile(
      filter: { sourceInstanceName: { eq: "images" } }
      sort: { fields: name, order: ASC }
    ) {
      edges {
        node {
          childImageSharp {
            resize(width: 600, quality: 75) {
              src
            }
          }
        }
      }
    }
  }
`;
