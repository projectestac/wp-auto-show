import React from 'react';
import Button from '@material-ui/core/Button';
import PlayArrow from '@material-ui/icons/PlayArrow'
import SaveIcon from '@material-ui/icons/SaveAlt';

function ActionButtons(props) {

  const { conf, saveSettings, i18n, t, getUrls, getExcerpts, setPlaying } = props;

  const exportToFile = () => {
    saveSettings();
    const fileName = 'show.html';
    const content = `<!DOCTYPE html>
<html lang="${i18n.language}">
<head>
  <meta charset="utf-8" />
  <title>Page Carousel</title>
  <meta name="description" content="Generated with WP-Show"/>
  <meta name="url" content="http://projectestac.github.io/wpshow/"/>
</head>
<body style="padding:0;margin:0">
  <div style="width:100%;height:100vh;margin:0;padding:0;overflow:hidden;">
    <iframe src="" style="width:100%;height:100%;" name="view" title="Page view" allowFullScreen="true"
      onLoad="window.scrollTo(0, 0)">
      <p>Your browser does not support iframes!</p>
    </iframe>
  </div>
  <script>
    const urls = ${JSON.stringify(getUrls()).replace(/","/g, '",\n      "')};
    const interval = ${conf.interval};
    let currentPage = 0;
    const iframe = document.querySelector('iframe');
    iframe.setAttribute('src', urls[0]);
    window.setInterval(() => {
      currentPage = (currentPage + 1) % urls.length;
      iframe.setAttribute('src', urls[currentPage]);
    }, interval * 1000);
  </script>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  const exportToBulletin = () => {
    saveSettings();
    const fileName = 'bulletin.html';
    const content = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">     
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${t('bulletin_title')}</title>     
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>     
  </head>
  <body>
${getExcerpts().map(({ link, title, excerpt }) => `<h1>${title}</h1>\n<article>${excerpt}</article>`).join('\n')}
  </body>     
</html>`;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  // Set the `playing` value to true 
  const play = () => {
    saveSettings();
    setPlaying(true);
  }

  return (
    <div className="playBtn">
      <Button
        variant="contained"
        color="primary"
        onClick={exportToBulletin}
        disabled={conf.numUrls === 0}
      >
        {t('export_bulletin')}
        <SaveIcon className="leftIcon" />
      </Button>


      <Button
        variant="contained"
        color="primary"
        onClick={exportToFile}
        disabled={conf.numUrls === 0}
      >
        {t('export_carousel')}
        <SaveIcon className="leftIcon" />
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={play}
        disabled={conf.numUrls === 0}
      >
        {t('start')}
        <PlayArrow className="leftIcon" />
      </Button>
    </div>
  );
}

export default ActionButtons;
