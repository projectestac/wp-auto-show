import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Waiting({ t }) {
  return (
    <div className="waiting">
      <h4>{t('loading')}</h4>
      <CircularProgress className="wheel" />
    </div>
  );
}

export default Waiting;
