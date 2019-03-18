import React, { useState } from 'react';
import './App.css';
import fetchJsonp from 'fetch-jsonp';
import PageCarousel from './components/PageCarousel';
import Settings from './components/Settings';
import Button from '@material-ui/core/Button';
import PlayArrow from '@material-ui/icons/PlayArrow'

function App() {

  const [conf, setConf] = useState({
    wpSite: localStorage.getItem('wpSite') || '',
    interval: 5000,
    ready: false,
    err: null,
    loading: false,
    categories: null,
    pages: null,
    posts: null,
    dateFrom: new Date('01/01/2013'),
    dateTo: new Date(),
    includeCategoryPages: true,
  });

  const [playing, setPlaying] = useState(false);

  const handleFetchErrors = (response) => {
    if (!response.ok)
      throw Error(response.statusText || 'Error desconegut');
    return response;
  }

  const checkSite = () => {
    // Remove trailing slashes, if any
    let base = conf.wpSite;
    while (base.endsWith('/'))
      base = base.substr(0, base.length - 1);

    setConf({ ...conf, wpSite: base, err: null, loading: true, categories: null, pages: null, posts: null });

    const categories = [], posts = [], pages = [];
    Promise.all([
      apiQuery(base, 'categories', ['id', 'link', 'name'], categories),
      apiQuery(base, 'pages', ['id', 'link', 'modified', 'type', 'status', 'title'], pages),
      apiQuery(base, 'posts', ['id', 'link', 'modified', 'type', 'status', 'title', 'categories'], posts),
    ])
      .then(() => {
        console.log(`Data received: ${pages.length} pages and ${categories.length} categories`)
        localStorage.setItem('wpSite', base);
        // Set all elements selected
        [categories, pages, posts].forEach(set => set.forEach(el => el.selected = true));
        // Convert 'modified' string to Date object
        [pages, posts].forEach(set => set.forEach(el => el.modified = new Date(el.modified)));
        setConf({ ...conf, loading: false, categories, pages, posts });
      })
      .catch(err => {
        console.log(`Error fetching data: ${err}`)
        setConf({ ...conf, loading: false, err });
      })
  }

  const apiQuery = (base, query, fields, result = [], pageSize = 100, page = 0, pages = 1) => {
    const url = `${base}/wp-json/wp/v2/${query}/?page=${++page}&per_page=${pageSize}&_envelope=1&${fields.map(f => `_fields[]=${f}`).join('&')}`;
    console.log(`Fetching page ${page}/${pages} of ${url}`)

    const next = () => page < pages ? apiQuery(base, query, fields, result, pageSize, page, pages) : result;

    return fetchJsonp(url, {
      jsonpCallback: '_jsonp',
      timeout: 7000,
    })
      .then(response => handleFetchErrors(response))
      .then(response => response.json())
      .then(data => {
        if (data.headers && data.headers['X-WP-TotalPages'])
          pages = data.headers['X-WP-TotalPages'];
        if (data.body)
          result.push(...data.body);
        return next();
      })
      .catch(err => {
        console.log(`Error fetching page ${page} of ${query}: ${err}`);
        return next();
      })
  }

  const selectPostsByDateAndCategory = (dateFrom = conf.dateFrom, dateTo = conf.dateTo) => {
    const activeCategories = [];
    conf.categories.forEach(cat => { if (cat.selected) activeCategories.push(cat.id) });
    conf.posts.forEach(post => {
      const categories = post.categories || [];
      post.selected = post.modified >= dateFrom
        && post.modified <= dateTo
        && categories.map(cat => activeCategories.includes(cat)).includes(true);
    });
    setConf({ ...conf, dateFrom, dateTo, err: null });
  }

  const getUrls = () => {
    const urls = [];
    urls.push(...conf.pages.filter(page => page.selected).map(page => page.link));
    urls.push(...conf.posts.filter(post => post.selected).map(post => post.link));
    if (conf.includeCategoryPages)
      urls.push(...conf.categories.filter(cat => cat.selected).map(cat => cat.link));
    return shuffle(urls);
  }

  const countUrls = () => {
    return conf.pages.filter(page => page.selected).length
      + conf.posts.filter(post => post.selected).length
      + conf.includeCategoryPages ? conf.categories.filter(cat => cat.selected).length : 0;
  }

  // Implementation of the Fisher-Yates (aka Knuth) Shuffle algorithm
  // See: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  const shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  const play = () => setPlaying(true);

  return (
    <div className="App">
      {!playing && <Settings {...{ conf, setConf, checkSite, selectPostsByDateAndCategory }} />}
      {!playing && conf.categories &&
        <Button className="playBtn"
          variant="contained"
          color="primary"
          onClick={play}
          disabled={countUrls() === 0}
        >
          Inicia la visualització
        <PlayArrow className="leftIcon"/>
        </Button>
      }
      {playing && <PageCarousel urls={getUrls()} interval={conf.interval} />}
    </div>
  );
}

export default App;
