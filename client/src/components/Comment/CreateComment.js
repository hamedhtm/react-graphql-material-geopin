import React, { useContext, useState } from 'react';
import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import { Context } from '../../Context';
import { graphQLClient } from '../../utils/graphQLClient';
import { CREATE_COMMENT } from '../../graphql/mutations';

const CreateComment = ({ classes }) => {
  const {
    state: { currentPin },
    createCommentContext,
  } = useContext(Context);
  const [comment, setComment] = useState('');

  const handleCommentSubmit = async () => {
    const variables = { pinId: currentPin._id, text: comment };
    const client = graphQLClient();
    const { createComment } = await client.request(CREATE_COMMENT, variables);
    createCommentContext(createComment);
    setComment('');
  };
  return (
    <>
      <form className={classes.form}>
        <IconButton
          className={classes.clearButton}
          onClick={() => setComment('')}
          disabled={!comment.trim()}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder={'Add Comment'}
          multiline
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <IconButton
          className={classes.sendButton}
          onClick={handleCommentSubmit}
          disabled={!comment.trim()}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 0,
    color: 'red',
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark,
  },
});

export default withStyles(styles)(CreateComment);
