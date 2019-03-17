import React, { useState } from 'react';
import './App.css';
import fetchJsonp from 'fetch-jsonp';
// import PageCarousel from './components/PageCarousel';
import Settings from './components/Settings';

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
  });

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
        [categories, pages, posts].forEach(set => set.forEach(el => el.selected = true));
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

  return (
    <div className="App">
      <Settings {...{ conf, setConf, checkSite }} />

      {
        /**
        <PageCarousel urls={[
          'https://agora.xtec.cat/ceiparturmartorell/',
          'https://agora.xtec.cat/ceiparturmartorell/categoria/infantil/p5/',
          'https://agora.xtec.cat/ceiparturmartorell/portada/les-geologues-i-els-geolegs-de-tercer/',
          'https://agora.xtec.cat/ceiparturmartorell/categoria/general/biblio/'
        ]} />
        */
      }
    </div>
  );
}

export default App;
