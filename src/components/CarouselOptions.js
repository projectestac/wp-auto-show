import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function CarouselOptions({ conf, setConf, t }) {

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
      <h3>{t('show_options')}</h3>
      <p>{t('selected_elements', { count: conf.numUrls })}</p>
      <TextField
        id="interval"
        label={t('timelapse')}
        className="intervalInput"
        variant="outlined"
        type="number"
        value={conf.interval}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleIntervalChange}
        InputProps={{
          endAdornment: <InputAdornment position="end">{t('seconds')}</InputAdornment>
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
        label={t('random')}
      />
      <FormControlLabel
        control={
          <Switch
            id='includeCategoryPages'
            checked={conf.includeCategoryPages}
            onChange={handleSwitchChange}
          />
        }
        label={t('include_category_pages')}
      />
      <FormControlLabel
        control={
          <Switch
            id='includeTagPages'
            checked={conf.includeTagPages}
            onChange={handleSwitchChange}
          />
        }
        label={t('include_tag_pages')}
      />
    </div>
  );
}

export default CarouselOptions;