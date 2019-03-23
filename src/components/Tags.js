import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

function Tags({ conf: { tags }, selectPostsByDateAndCategory, t }) {

  const [allTags, setAllTags] = React.useState(false);

  const handleListClick = tag => () => {
    tag.selected = !tag.selected;
    if (!tag.selected)
      setAllTags(false);
    selectPostsByDateAndCategory();
  }

  const checkAllTags = () => {
    tags.forEach(tag => { tag.selected = !allTags });
    selectPostsByDateAndCategory();
    setAllTags(!allTags);
  }

  return (
    <div>
      <h3>{t('tags')}</h3>
      <FormControlLabel
        control={
          <Checkbox
            checked={allTags}
            onChange={checkAllTags}
          />
        }
        label={t('tags_select_all')}
      />
      <List className="catList" component="nav">
        {tags.map((tag, i) => (
          <ListItem
            key={i}
            selected={tag.selected}
            onClick={handleListClick(tag)}
          >
            <ListItemText>
              <span dangerouslySetInnerHTML={{ __html: tag.name }} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <Typography variant="body2">
        {tags.filter(tag => tag.selected).length}/{tags.length} {t('tags_selected')}
      </Typography>
    </div>
  );
}

export default Tags;
