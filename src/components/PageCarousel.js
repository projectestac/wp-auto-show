import React, { useState } from 'react';

function PageCarousel(props) {

  const [currentPage, setCurrentPage] = useState(0);
  const { urls, interval } = props;

  window.setTimeout(() => {
    setCurrentPage((currentPage + 1) % urls.length);
  }, interval * 1000);

  return (
    <div className="fullFrame">
      <iframe
        className="pageView"
        name="view"
        title="Page view"
        allowFullScreen="true"
        src={urls[currentPage]}
        onLoad={() => window.scrollTo(0, 0)}
      >
        <p>Your browser does not support iframes!</p>
      </iframe>
    </div>
  );
}

export default PageCarousel;
