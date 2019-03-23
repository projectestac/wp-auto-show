import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

function Posts({ conf: { posts }, countUrls, t }) {

  const [allPosts, setAllPosts] = React.useState(false);

  const handleListClick = post => () => {
    post.selected = !post.selected;
    if (!post.selected)
      setAllPosts(false);
    countUrls();
  };

  const checkAllPosts = () => {
    posts.forEach(post => { post.selected = !allPosts });
    countUrls();
    setAllPosts(!allPosts);
  };

  return (
    <div>
      <h3>{t('posts')}</h3>
      <FormControlLabel
        control={
          <Checkbox
            checked={allPosts}
            onChange={checkAllPosts}
          />
        }
        label={t('posts_select_all')}
      />
      <List component="nav" className="postList">
        {posts.filter(post => post.inRange).map((post, i) => (
          <ListItem
            key={i}
            selected={post.selected}
            onClick={handleListClick(post)}
          >
            <ListItemText
              primary={<span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />}
              secondary={post.modified.toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="body2">
        {posts.filter(post => post.selected).length}/{posts.filter(post => post.inRange).length} {t('posts_selected')}
      </Typography>
    </div>
  );
}

export default Posts;
