import React from 'react';

function Header() {
  return (
    <header className="head">
      <h2><img src="ico/icon64.png" alt="Logotip" className="logo" />Carrusel d'articles WordPress</h2>
      <p>
        Aquesta aplicació permet mostrar de manera automàtica el contingut d'un lloc web que
        funcioni amb <a href="https://wordpress.org">WordPress</a>, com ara XTEC-Blocs o Àgora-Nodes.
      </p>
      <p>
        Introduïu l'URL del lloc web que vulgueu mostrar, espereu que es carreguin les dades (pot trigar una estona llarga!)
        i seleccioneu paràmetres com ara el rang de dates, les categories, les etiquetes o les pàgines que vulgueu que es mostrin. També podeu
        marcar i desmarcar individualment cada un dels articles i pàgines per indicar si han d'aparèixer al carrusel.
      </p>
      <p>
        Un cop seleccionat el contingut a mostrar indiqueu el temps d'espera entre una pàgina i la següent, així com si voleu
        que es mostrin les pàgines a l'atzar o bé ordenades per data de publicació. Finalment, feu clic al botó "Inicia la presentació"
        i veureu com les pàgines aniran mostrant-se de manera automàtica a la finestra principal, que podeu posar en mode de pantalla
        completa amb la tecla <strong>F11</strong>.
      </p>
    </header>
  );
}

export default Header;