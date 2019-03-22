import * as React from 'react';
import './style.scss';
import styled, { keyframes } from 'styled-components';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import RootRef from '@material-ui/core/RootRef';
import Chip from '@material-ui/core/Chip';

import { CombinedProps } from './index';

const Wrapper = styled.div`
  position: relative;
  text-align: center;
  margin-left: 8px;

  & :nth-child(2) {
    animation-delay: -1.1s;
  }

  & :nth-child(3) {
    animation-delay: -0.9s;
  }
`;

const anim = keyframes`
	0%, 60%, 100% {
		transform: initial;
	}

	30% {
		transform: translateY(-12px);
	}`;

const Dot = styled.span`
  background: white;
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 3px;
  animation: ${anim} 1.3s linear infinite;
`;

const BouncingDots = () => (
  <Wrapper>
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <Dot key={i} />
      ))}
  </Wrapper>
);

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
  onMessageWrite,
  messages,
  handleMessageSubmit,
  onListRef,
  writers,
  isWriting,
}: CombinedProps) => {
  const formatChip = () => {
    if (writers.length === 1) return `${writers[0]} is writing...`;
    if (writers.length <= 3) return `${writers.join(', ')} are writing...`;
    return `${writers.slice(0, 2).join(', ')} and ${
      writers.slice(2).length
    } others are writing...`;
  };

  return (
    <div id="chat">
      <div className="list--chat">
        <RootRef rootRef={onListRef}>
          <List>{getMessages(messages)}</List>
        </RootRef>
      </div>
      {isWriting && (
        <Chip label={formatChip()} color="primary" icon={<BouncingDots />} />
      )}
      <TextField
        multiline={true}
        rows="1"
        rowsMax="5"
        placeholder="Type here..."
        margin="normal"
        value={state}
        onChange={onMessageWrite}
        className="textfield--fullwidth"
      />
      <Fab color="secondary" aria-label="Send" onClick={handleMessageSubmit}>
        <Icon>done</Icon>
      </Fab>
    </div>
  );
};
