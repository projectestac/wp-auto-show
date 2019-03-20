import React, { useState } from 'react';

function PageCarousel({ urls, interval }) {

  // Hook for tracking the current page index
  const [currentPage, setCurrentPage] = useState(0);

  // Prepare the next page
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
