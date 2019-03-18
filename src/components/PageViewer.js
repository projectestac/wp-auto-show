import React from 'react'

function PageViewer(props) {

  const { url, title = "Current page", width = "100%", height = "100%", allowFullScreen = true } = props;

  return (
    <iframe
      title={title}
      allowFullScreen={allowFullScreen}
      width={width}
      height={height}
      src={url}>
      <p>Your browser does not support iframes!</p>
    </iframe>
  );

}

export default PageViewer