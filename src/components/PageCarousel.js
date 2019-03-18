import React, { useState } from 'react';
import PageViewer from './PageViewer';

function PageCarousel(props) {

  const [currentPage, setCurrentPage] = useState(0);
  const { urls, interval } = props;

  window.setTimeout(() => {
    setCurrentPage(currentPage + 1 % urls.length);
  }, interval);

  return <PageViewer url={urls[currentPage]} />
}

export default PageCarousel;
