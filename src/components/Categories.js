import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Categories(props) {

  const { conf, setConf, selectPostsByDateAndCategory } = props;
  const [allCategories, setAllCategories] = React.useState(true);

  const handleListClick = category => () => {
    category.selected = !category.selected;
    if (!category.selected)
      setAllCategories(false);
    selectPostsByDateAndCategory();
  }

  const checkAllCategories = () => {
    conf.categories.forEach(cat => { cat.selected = !allCategories });
    selectPostsByDateAndCategory();
    setAllCategories(!allCategories);
  }

  const checkIncludeCategoryPages = () => {
    setConf({ ...conf, includeCategoryPages: !conf.includeCategoryPages });
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
      <FormControlLabel
        control={
          <Checkbox
            checked={conf.includeCategoryPages}
            onChange={checkIncludeCategoryPages}
          />
        }
        label="Mostra també les pàgines de categoria"
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
