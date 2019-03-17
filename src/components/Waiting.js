import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

function Waiting() {
  return (
    <div className="waiting">
      <Typography component='h2'>S'estan llegint les dades...</Typography>
      <CircularProgress />
    </div>
  );
}

export default Waiting;