import React from 'react';
import validator from 'validator';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Waiting from './Waiting';
import Categories from './Categories';
import Tags from './Tags';
import Posts from './Posts';
import Pages from './Pages';
import Dates from './Dates';
import CarouselOptions from './CarouselOptions';

function Settings({ conf, setConf, checkSite, selectPostsByDateAndCategory, countUrls, t, i18n }) {

  const handleChange = ev => setConf({ ...conf, [ev.target.id]: ev.target.value })

  return (
    <Paper className="main">
      <div className="sitePrompt">
        <TextField
          id="wpSite"
          label={t('url')}
          value={conf.wpSite}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={checkSite}
          disabled={!validator.isURL(conf.wpSite)}
        >
          {t('connect')}
        </Button>
      </div>
      {conf.loading && <Waiting {...{t}}/>}
      {conf.err && <p className="error">{`${t('error')}: ${conf.err}`}</p>}
      {conf.posts && <Dates {...{ conf, setConf, selectPostsByDateAndCategory, t, i18n }} />}
      {conf.categories && <Categories {...{ conf, setConf, selectPostsByDateAndCategory, t }} />}
      {conf.tags && <Tags {...{ conf, setConf, selectPostsByDateAndCategory, t }} />}
      {conf.posts && <Posts {...{ conf, countUrls, t }} />}
      {conf.pages && <Pages {...{ conf, countUrls, t }} />}
      {conf.categories && <CarouselOptions {...{ conf, setConf, t }} />}
    </Paper>
  );
}

export default Settings;
