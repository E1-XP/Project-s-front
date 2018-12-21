import * as React from 'react';
import './style.scss';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import RootRef from '@material-ui/core/RootRef';

import { CombinedProps } from './index';

const getMessages = (messages: CombinedProps['messages']) =>
  messages.length ? (
    messages.map((itm, i) => (
      <ListItem key={i}>
        <Avatar>
          <Icon>account_circle</Icon>
        </Avatar>
        <ListItemText
          primary={itm.author}
          secondary={itm.message}
          className="text--wordbreak"
        />
      </ListItem>
    ))
  ) : (
    <ListItem>No Messages found. Write the first one!</ListItem>
  );

export const ChatComponent = ({
  state,
  setMessage,
  messages,
  handleMessageSubmit,
  onListRef,
}: CombinedProps) => {
  return (
    <div id="chat">
      <div className="list--chat">
        <RootRef rootRef={onListRef}>
          <List>{getMessages(messages)}</List>
        </RootRef>
      </div>
      <TextField
        multiline={true}
        rows="1"
        rowsMax="5"
        placeholder="Type here..."
        margin="normal"
        value={state}
        onChange={setMessage}
        className="textfield--fullwidth"
      />
      <Fab color="secondary" aria-label="Send" onClick={handleMessageSubmit}>
        <Icon>done</Icon>
      </Fab>
    </div>
  );
};
