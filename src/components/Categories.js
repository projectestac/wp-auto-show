import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Categories(props) {

  const { conf, setConf } = props;
  const [allCategories, setAllCategories] = React.useState(true);

  const handleListClick = category => () => {
    category.selected = !category.selected;
    if (!category.selected)
      setAllCategories(false);
    setConf({ ...conf });
  }

  const checkAllCategories = () => {
    conf.categories.forEach(cat => { cat.selected = !allCategories });
    setConf({ ...conf });
    setAllCategories(!allCategories);
  }

  return (
    <div>
      <h2>Categories</h2>
      <FormControlLabel
        control={
          <Checkbox
            checked={allCategories}
            onChange={checkAllCategories}
          />
        }
        label="Selecciona totes les categories"
      />
      <List component="nav">
        {conf.categories.map((cat, i) => (
          <ListItem
            key={i}
            selected={cat.selected}
            onClick={handleListClick(cat)}
          >
            <ListItemText>
              <span dangerouslySetInnerHTML={{ __html: cat.name }} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Categories;
