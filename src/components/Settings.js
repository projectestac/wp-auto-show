import React from 'react';
import validator from 'validator';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Waiting from './Waiting';
import Categories from './Categories';
import Posts from './Posts';
import Pages from './Pages';
import Dates from './Dates';
import CarouselOptions from './CarouselOptions';

function Settings(props) {

  const { conf, setConf, checkSite, selectPostsByDateAndCategory } = props;

  const handleChange = ev => setConf({ ...conf, [ev.target.id]: ev.target.value })

  return (
    <Paper className="main">
      <div className="sitePrompt">
        <TextField
          id="wpSite"
          label="URL del lloc web WordPress (bloc, Nodes...)"
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
          Connecta
        </Button>
      </div>
      {conf.loading && <Waiting />}
      {conf.err && <p className="error">ERROR: {conf.err}</p>}
      {conf.posts && <Dates {...{ conf, setConf, selectPostsByDateAndCategory }} />}
      {conf.categories && <Categories {...{ conf, setConf, selectPostsByDateAndCategory }} />}
      {conf.posts && <Posts {...{ conf, setConf }} />}
      {conf.pages && <Pages {...{ conf, setConf }} />}
      {conf.categories && <CarouselOptions {...{ conf, setConf }} />}
    </Paper>
  );

}

export default Settings;


