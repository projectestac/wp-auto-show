import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Waiting() {
  return (
    <div className="waiting">
      <h4>S'estan llegint les dades...</h4>
      <CircularProgress className="wheel"/>
    </div>
  );
}

export default Waiting;