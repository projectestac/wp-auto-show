import React from 'react';
import { title, version, repository, license } from '../../package.json';

function Footer({ t }) {
  return (
    <footer className="foot">
      <p>
        <a href={repository.url}>{title} v{version}</a><br />
        <a href="http://www.xtec.cat">{t('copyright')}</a><br />
        <a href={`https://spdx.org/licenses/${license}.html`}>{t('license')} {license}</a><br />
        <a href={repository.url}>{repository.url}</a>
      </p>
    </footer>
  );
}

export default Footer;