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

  render() {
    const { firstImageLoaded } = this.state;
    const image = this.currentImage();
    const siteTitle = 'The sweetest boys';
    const siteDescription =
      'A website to show off pictures of the sweet cats Tracker and Casey';

    return (
      <div className="wrapper" onClick={() => this.nextImage()}>
        <Helmet>
          <link
            key="shortcut-icon"
            rel="shortcut icon"
            href="/favicon.ico"
            type="image/x-icon"
          />
          <link key="icon" rel="icon" href="/favicon.ico" type="image/x-icon" />

          <title itemProp="name" lang="en">
            {siteTitle}
          </title>

          <meta name="description" content={siteDescription} />

          <meta name="twitter:card" value="summary" />

          <meta property="og:title" content={siteTitle} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://trackerandcasey.pet" />
          <meta property="og:image" content={`https://trackerandcasey.pet${image.src}`} />
          <meta property="og:description" content={siteDescription} />
        </Helmet>
        <div
          className="background"
          style={{ backgroundImage: `url(${image.src})` }}
        />
        <img
          src={image.src}
          alt="Sweet cat being sweet"
          style={{ opacity: firstImageLoaded ? 1 : 0 }}
        />
      </div>
    );
  }
}

export const PageQuery = graphql`
  query IndexQuery {
    images: allFile(filter: { sourceInstanceName: { eq: "images" } }) {
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
