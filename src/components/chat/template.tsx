import React from 'react';
import EmojiPicker from 'emoji-picker-react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import RootRef from '@material-ui/core/RootRef';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import { CombinedProps } from './index';

import { Heading } from './../shared/heading';

import {
  Wrapper,
  Dot,
  ChatListWrapper,
  TextFieldWithPadding,
  ChipWithOpacity,
} from './style';

const BouncingDots = () => (
  <Wrapper>
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <Dot key={i} />
      ))}
  </Wrapper>
);

const textFieldContainerStyle: Record<string, string | number> = {
  position: 'relative',
  justifyContent: 'end',
};

const wordBreakStyle: Record<string, string | number> = {
  wordBreak: 'break-all',
};

const getMessages = (
  messages: CombinedProps['messages'],
  user: CombinedProps['user'],
) =>
  messages.length ? (
    messages.map((itm, i) => (
      <ListItem key={itm.id}>
        <Avatar>
          <Icon>account_circle</Icon>
        </Avatar>
        <ListItemText
          primary={itm.author}
          secondary={itm.message}
          style={wordBreakStyle}
          primaryTypographyProps={{
            color: itm.authorId === user!.id! ? 'primary' : ('default' as any),
            style: {
              fontWeight: itm.authorId === user!.id! ? 600 : 'inherit',
            },
          }}
        />
      </ListItem>
    ))
  ) : (
    <ListItem>No Messages found. Write the first one!</ListItem>
  );

const popoverPlacement: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

const popoverTransform: PopoverOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

export const ChatComponent = ({
  state,
  onMessageWrite,
  messages,
  user,
  handleMessageSubmit,
  onListRef,
  writers,
  isWriting,
  toggleEmojiPicker,
  handleEmojiClick,
  chatHeight,
  heading,
}: CombinedProps) => {
  const formatChip = () => {
    if (writers.length === 1) return `${writers[0]} is writing...`;
    if (writers.length <= 3) return `${writers.join(', ')} are writing...`;

    return `${writers.slice(0, 2).join(', ')} and ${
      writers.slice(2).length
    } others are writing...`;
  };

  const shouldAutofocus = window.innerWidth > 1280;

  return (
    <Paper>
      <Heading text={heading} icon="chat" />
      <ChatListWrapper chatHeight={chatHeight}>
        <RootRef rootRef={onListRef}>
          <List>{getMessages(messages, user)}</List>
        </RootRef>
      </ChatListWrapper>
      <ChipWithOpacity
        label={formatChip()}
        color="primary"
        icon={<BouncingDots />}
        isWriting={isWriting}
      />
      <Popover
        open={state.isEmojiPickerOpen}
        onClose={toggleEmojiPicker}
        anchorEl={state.emojiPickerAnchorRef}
        anchorOrigin={popoverPlacement}
        transformOrigin={popoverTransform}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>
      <Grid container={true} style={textFieldContainerStyle}>
        <TextFieldWithPadding
          variant="filled"
          multiline={true}
          rows="1"
          rowsMax="5"
          placeholder="Type here..."
          margin="normal"
          value={state.message}
          onChange={onMessageWrite}
          onKeyDown={handleMessageSubmit}
          autoFocus={shouldAutofocus}
          fullWidth={true}
        />
        <IconButton
          aria-label="select emoji"
          disableRipple={true}
          onClick={toggleEmojiPicker}
        >
          <Icon fontSize="small">insert_emoticon</Icon>
        </IconButton>
        <IconButton aria-label="send message" onClick={handleMessageSubmit}>
          <Icon fontSize="small">send</Icon>
        </IconButton>
      </Grid>
    </Paper>
  );
};
