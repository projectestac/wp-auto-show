import React from 'react';

function Header(props) {
  const { t, i18n } = props;

  function Lang(props) {
    const { language, code } = props;
    return <li
      onClick={() => i18n.changeLanguage(code)}
      className={code === i18n.language ? 'curLang' : ''}
      title={language}
    >
      {code}
    </li>
  }

  return (
    <header className="head">
      <nav className="langSelector">
        <ul>
          <Lang language="català" code="ca" />
          <Lang language="español" code="es" />
          <Lang language="English" code="en" />
        </ul>
      </nav>
      <h2><img src="ico/icon64.png" alt="Logotip" className="logo" />{t('title')}</h2>
      <p>{t('desc1')}</p>
      <p>{t('desc2')}</p>
      <p>{t('desc3')}</p>
      <p>{t('desc4')}</p>
    </header>
  );
}

export default Header;