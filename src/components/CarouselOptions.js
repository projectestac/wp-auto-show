import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function CarouselOptions({ conf, setConf }) {

  const handleIntervalChange = ev => {
    const v = ev.target.value;
    if (v > 0 && v < 100)
      setConf({ ...conf, [ev.target.id]: v });
  }

  const handleSwitchChange = ev => {
    setConf({ ...conf, [ev.target.id]: ev.target.checked === true });
  }

  return (
    <div className="options">
      <h3>Opcions de visualització</h3>
      <TextField
        id="interval"
        label="Temps entre pàgines"
        className="intervalInput"
        variant="outlined"
        type="number"
        value={conf.interval}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleIntervalChange}
        InputProps={{
          endAdornment: <InputAdornment position="end">Segons</InputAdornment>
        }}
      />
      <FormControlLabel
        control={
          <Switch
            id='randomOrder'
            checked={conf.randomOrder}
            onChange={handleSwitchChange}
          />
        }
        label="Mostra les pàgines i els articles en ordre aleatori"
      />
      <FormControlLabel
        control={
          <Switch
            id='includeCategoryPages'
            checked={conf.includeCategoryPages}
            onChange={handleSwitchChange}
          />
        }
        label="Mostra també les pàgines de les categories (blogs de curs...)"
      />
    </div>
  );
}

export default CarouselOptions;