import React, { Component } from 'react';
import PageViewer from './PageViewer';

class PageCarousel extends Component {

  state = {
    currentPage: 0,
  }

  constructor(props) {
    super(props);

    const { urls = [''], timeLapse = 5000 } = props;

    window.setInterval(() => {
      this.setState({ currentPage: (this.state.currentPage + 1) % urls.length })
    }, timeLapse);

  }

  render() {
    const { urls } = this.props;
    const { currentPage } = this.state;
    return <PageViewer url={urls[currentPage]} />
  }
}

export default PageCarousel;
