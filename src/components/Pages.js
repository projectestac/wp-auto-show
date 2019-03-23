import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

function Pages({ conf: { pages }, countUrls, t }) {

  const [allPages, setAllPages] = React.useState(false);

  const handleListClick = page => () => {
    page.selected = !page.selected;
    if (!page.selected)
      setAllPages(false);
    countUrls();
  }

  const checkAllPages = () => {
    pages.forEach(page => { page.selected = !allPages });
    countUrls();
    setAllPages(!allPages);
  }

  return (
    <div>
      <h3>{t('pages')}</h3>
      <FormControlLabel
        control={
          <Checkbox
            checked={allPages}
            onChange={checkAllPages}
          />
        }
        label={t('pages_select_all')}
      />
      <List className="pagesList" component="nav">
        {pages.filter(page => page.inRange).map((page, i) => (
          <ListItem
            key={i}
            selected={page.selected}
            onClick={handleListClick(page)}
          >
            <ListItemText
              primary={<span dangerouslySetInnerHTML={{ __html: page.title.rendered }} />}
              secondary={page.modified.toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="body2">
        {pages.filter(page => page.inRange && page.selected).length}/{pages.filter(page => page.inRange).length} {t('pages_selected')}
      </Typography>
    </div>
  );
}

export default Pages;
