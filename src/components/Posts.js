import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Posts(props) {

  const { conf, setConf } = props;
  const [allPosts, setAllPosts] = React.useState(true);

  const handleListClick = post => () => {
    post.selected = !post.selected;
    if (!post.selected)
      setAllPosts(false);
    setConf({ ...conf });
  };

  const checkAllPosts = () => {
    conf.posts.forEach(post => { post.selected = !allPosts });
    setConf({ ...conf });
    setAllPosts(!allPosts);
  }

  return (
    <div>
      <h3>Articles</h3>
      <FormControlLabel
        control={
          <Checkbox
            checked={allPosts}
            onChange={checkAllPosts}
          />
        }
        label="Selecciona tots els articles"
      />
      <List component="nav" className="postList">
        {conf.posts.map((post, i) => (post.type === 'post' && post.status === 'publish' &&
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
    </div>
  );
}

export default Posts;
