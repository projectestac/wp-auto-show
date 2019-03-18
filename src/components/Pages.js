import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Pages(props) {

  const { conf, setConf } = props;
  const [allPages, setAllPages] = React.useState(true);

  const handleListClick = page => () => {
    page.selected = !page.selected;
    if (!page.selected)
      setAllPages(false);
    setConf({ ...conf });
  }

  const checkAllPages = () => {
    conf.pages.forEach(page => { page.selected = !allPages });
    setConf({ ...conf });
    setAllPages(!allPages);
  }

  return (
    <div>
      <h3>Pàgines</h3>
      <FormControlLabel
        control={
          <Checkbox
            checked={allPages}
            onChange={checkAllPages}
          />
        }
        label="Selecciona totes les pàgines"
      />
      <List className="pagesList" component="nav">
        {conf.pages.map((page, i) => (page.type === 'page' && page.status === 'publish' &&
          <ListItem
            key={i}
            selected={page.selected}
            onClick={handleListClick(page)}
          >
            <ListItemText>
              <span dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Pages;
