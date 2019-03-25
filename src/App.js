import React, { useState } from 'react';
import './App.css';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import fetchJsonp from 'fetch-jsonp';
import PageCarousel from './components/PageCarousel';
import Settings from './components/Settings';
import Header from './components/Header';
import ActionButtons from './components/ActionButtons';
import Footer from './components/Footer';


const STORED_VALUES = JSON.parse(localStorage.getItem('wpShow') || '{}');

/**
 * Main stateles component 
 */
function App() {

  const { t } = useTranslation();

  // Hook with miscellaneous state variables
  const [conf, setConf] = useState({
    wpSite: STORED_VALUES.wpSite || '',
    interval: STORED_VALUES.interval || 10,
    ready: false,
    err: null,
    loading: false,
    categories: null,
    tags: null,
    pages: null,
    posts: null,
    dateFrom: new Date(STORED_VALUES.from || Date.now()),
    dateTo: new Date(STORED_VALUES.to || Date.now()),
    dateFirst: new Date(),
    includeCategoryPages: !(STORED_VALUES.includeCategoryPages === false),
    includeTagPages: STORED_VALUES.includeTagPages === true,
    randomOrder: !(STORED_VALUES.randomOrder === false),
    numUrls: 0,
  });

  // Specific hook for 'playing'
  const [playing, setPlaying] = useState(false);

  // Always check if fetch responses have the 'ok' attribute 
  const handleFetchErrors = (response) => {
    if (!response.ok)
      throw Error(response.statusText || 'Error desconegut');
    return response;
  }

  // Obtain information from the WordPress site fetching multiple API services
  const checkSite = () => {

    // Remove trailing slashes, if any
    let base = conf.wpSite;
    while (base.endsWith('/'))
      base = base.substr(0, base.length - 1);

    // Set the `loading` flag and reset conf to default values
    setConf({
      ...conf,
      wpSite: base,
      err: null,
      loading: true,
      categories: null,
      pages: null,
      posts: null,
      numUrls: 0,
    });

    // Initialize main arrays and launch API queries
    let categories = [], tags = [], posts = [], pages = [];
    Promise.all([
      apiQuery(base, 'categories', ['id', 'link', 'name', 'count'], categories),
      apiQuery(base, 'tags', ['id', 'link', 'name', 'count'], tags),
      apiQuery(base, 'pages', ['id', 'link', 'modified', 'type', 'status', 'title'], pages),
      apiQuery(base, 'posts', ['id', 'link', 'modified', 'type', 'status', 'title', 'categories', 'tags'], posts),
    ])
      .then(() => {
        if (categories.length === 0)
          throw new Error("No s'ha trobat cap categoria! Podria ser que l'adreça fos incorrecta, que ara mateix no estigui funcionant o que no es tracti d'un lloc WordPress");

        // Select only categories and tags with at least one post, and sort them alphabetically
        categories = categories.filter(cat => cat.count > 0).sort((a, b) => a.name < b.name ? -1 : 1);
        tags = tags.filter(tag => tag.count > 0).sort((a, b) => a.name < b.name ? -1 : 1);

        // Clear stored values if 'wpSite' has changed
        if (base !== STORED_VALUES.wpSite)
          Object.assign(STORED_VALUES, { categories: [], tags: [], pages: [], posts: [] });

        // Set the initial `selected` state for all items
        const sss = [STORED_VALUES.categories, STORED_VALUES.tags, STORED_VALUES.pages, STORED_VALUES.posts];
        [categories, tags, pages, posts].forEach((set, i) => set.forEach(el => el.selected = sss[i].includes(el.id)));

        // Convert the 'modified' string to Date objects, and find the oldest one
        let firstDate = new Date();
        [pages, posts].forEach(set => {
          set.forEach(el => {
            el.modified = new Date(el.modified)
            if (el.modified < firstDate)
              firstDate = el.modified;
          });
          set.sort((a, b) => {
            return a.modified > b.modified ? -1
              : a.modified < b.modified ? 1
                : a.title < b.title ? -1 : 1;
          });
        });

        // Move `firstDate` back one day
        let from = STORED_VALUES.from || firstDate - 24 * 60 * 60 * 1000;

        // Set inRange flag to `true` for all published posts and plages
        posts.forEach(post => post.inRange = post.type === 'post' && post.status === 'publish' && post.modified >= from);
        pages.forEach(page => page.inRange = page.type === 'page' && page.status === 'publish');

        // Unset `loading` and save the new state
        const { includeCategoryPages, includeTagPages } = conf;
        setConf({
          ...conf,
          loading: false,
          categories, tags, pages, posts,
          dateFirst: new Date(firstDate),
          dateFrom: new Date(from),
          dateTo: new Date(),
          numUrls: doCountUrls({ pages, posts, categories, tags, includeCategoryPages, includeTagPages }),
          err: null,
        });

      })
      .catch(err => {
        console.log(`Error fetching data: ${err.message}`);
        setConf({ ...conf, loading: false, err: err.message });
      })
  }

  // Query the WordPress REST API obtaining all the information related to one type of data
  // Results are obtained with paginated calls using the max size (100 records per call)
  // and requesting only specific fields 
  const apiQuery = (base, query, fields, result = [], pageSize = 100, page = 0, pages = 1) => {
    // Build the API URL
    const url = `${base}/wp-json/wp/v2/${query}/?page=${++page}&per_page=${pageSize}&_envelope=1&${fields.map(f => `_fields[]=${f}`).join('&')}`;

    console.log(`Fetching page ${page}/${pages} of ${url}`);

    // If there are more pages, prepare a recursive call to get more data
    // Return `result` otherwise
    const next = () => page < pages
      ? apiQuery(base, query, fields, result, pageSize, page, pages)
      : result;

    // Avoid CORS issues fetching the API in JSONP mode
    return fetchJsonp(url, {
      jsonpCallback: '_jsonp',
      timeout: 7000,
    })
      .then(response => handleFetchErrors(response))
      .then(response => response.json())
      .then(data => {
        // Read the total number of pages
        if (data.headers && data.headers['X-WP-TotalPages'])
          pages = data.headers['X-WP-TotalPages'];
        if (data.body)
          result.push(...data.body);
        // This will return `result` or just a promise call to the next page of results
        return next();
      })
      .catch(err => {
        console.log(`Error fetching page ${page} of ${query}: ${err}`);
        // Make the API call tolerant to errors, returning always the accumulated result
        return next();
      });
  }

  // Mark as selected posts created or updated between the specified dates, and
  // related to at least one selected category  
  const selectPostsByDateAndCategory = (dateFrom = conf.dateFrom, dateTo = conf.dateTo, posts = conf.posts, updateConf = true) => {

    // Get the ids of selected categories
    //const activeCategories = [], activetags=[];
    const activeCategories = conf.categories.filter(cat => cat.selected).map(cat => cat.id);
    const activeTags = conf.tags.filter(tag => tag.selected).map(tag => tag.id);

    // Select or unselect posts based on its date and categories
    posts.forEach(post => {
      const { categories, tags, modified, type, status } = post;
      post.inRange = modified >= dateFrom && modified <= dateTo && type === 'post' && status === 'publish';
      post.selected = post.inRange && (
        categories.map(cat => activeCategories.includes(cat)).includes(true) ||
        tags.map(tag => activeTags.includes(tag)).includes(true)
      );
    });

    // Update dates and clear the error flag, if set
    if (updateConf)
      setConf({ ...conf, dateFrom, dateTo, err: null, numUrls: countUrls(false) });
  }

  // Get the final list of URLs used in the carousel, maybe randomized
  const getUrls = () => {
    const { posts, pages, categories, tags, includeCategoryPages, includeTagPages, randomOrder } = conf;
    const urls = [];
    urls.push(...posts.filter(post => post.selected).map(post => post.link));
    urls.push(...pages.filter(page => page.selected).map(page => page.link));
    if (includeCategoryPages)
      urls.push(...categories.filter(cat => cat.selected).map(cat => cat.link));
    if (includeTagPages)
      urls.push(...tags.filter(cat => cat.selected).map(cat => cat.link));

    return randomOrder ? shuffle(urls) : urls;
  }

  // Count the current number of valid URLs
  const countUrls = (updateConf = true) => {
    const numUrls = doCountUrls(conf);
    if (updateConf)
      setConf({ ...conf, numUrls });
    return numUrls;
  }

  const doCountUrls = ({ pages, posts, categories, tags, includeCategoryPages, includeTagPages }) => {
    return pages.filter(page => page.selected).length
      + posts.filter(post => post.selected).length
      + (includeCategoryPages ? categories.filter(cat => cat.selected).length : 0)
      + (includeTagPages ? tags.filter(tag => tag.selected).length : 0);
  }

  // Shuffle the provided array using the Fisher-Yates (aka Knuth) algorithm
  // See: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  const shuffle = array => {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      let temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  const saveSettings = () => {
    // Update the `STORED_VALUES` object
    Object.assign(STORED_VALUES, {
      wpSite: conf.wpSite,
      interval: conf.interval,
      from: conf.dateFrom.getTime(),
      to: conf.dateTo.getTime(),
      includeCategoryPages: conf.includeCategoryPages,
      includeTagPages: conf.includeTagPages,
      randomOrder: conf.randomOrder,
      categories: conf.categories.filter(e => e.selected).map(e => e.id),
      tags: conf.tags.filter(e => e.selected).map(e => e.id),
      pages: conf.pages.filter(e => e.selected).map(e => e.id),
      posts: conf.posts.filter(e => e.selected).map(e => e.id),
    });

    // Save settings in browser's local storage
    localStorage.setItem('wpShow', JSON.stringify(STORED_VALUES));
  }

  // Main content
  return (
    <div className="App">
      {!playing &&
        <div>
          <Header {...{ t, i18n }} />
          <Settings {...{ conf, setConf, checkSite, selectPostsByDateAndCategory, countUrls, t, i18n }} />
          <ActionButtons {...{ conf, saveSettings, i18n, t, getUrls, setPlaying }} />
          <Footer {...{ t }} />
        </div>
      }
      {playing &&
        <PageCarousel urls={getUrls()} interval={conf.interval} />
      }
    </div>
  );
}

export default App;
