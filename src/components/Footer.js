import React from 'react';

function Footer({ t }) {
  return (
    <footer className="foot">
      <p>
        {t('copyright1')}<br />
        {t('copyright2')}<br />
        <a href="https://github.com/projectestac/wp-show">https://github.com/projectestac/wp-show</a>
      </p>
    </footer>
  );
}

export default Footer;