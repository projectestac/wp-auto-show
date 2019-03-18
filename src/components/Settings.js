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

function Settings(props) {

  const { conf, setConf, checkSite, selectPostsByDateAndCategory } = props;

  const handleChange = ev => setConf({ ...conf, [ev.target.id]: ev.target.value })

  return (
    <Paper className="main">
      <TextField
        id="wpSite"
        label="WordPress site URL"
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
      {conf.loading && <Waiting />}
      {conf.err && <p>ERROR: {conf.err}</p>}
      {conf.posts && <Dates {...{ conf, setConf, selectPostsByDateAndCategory }} />}
      {conf.categories && <Categories {...{ conf, setConf, selectPostsByDateAndCategory }} />}
      {conf.posts && <Posts {...{ conf, setConf }} />}
      {conf.pages && <Pages {...{ conf, setConf }} />}
    </Paper>
  );

}

export default Settings;


