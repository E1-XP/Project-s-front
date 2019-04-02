import React from 'react';
import styled, { keyframes } from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import RootRef from '@material-ui/core/RootRef';
import Chip from '@material-ui/core/Chip';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';

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

const ChatListWrapper = styled.div`
  height: 600px;
  overflow: auto;
`;

const posRelative = { position: 'relative' as 'relative' };

const PositionedIconButton = styled(IconButton)`
  position: absolute !important;
  right: 0;
  top: 0;

  & :hover {
    background-color: transparent;
  }
`;

const TextFieldWithPadding = styled(TextField)`
  margin-top: 0 !important;

  & :first-child {
    padding-top: 1.3rem;
  }
`;

const wordbreakStyle = {
  wordBreak: 'break-all' as 'break-all',
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
          style={wordbreakStyle}
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

const ChipWithOpacity = styled(({ isWriting, ...props }) => (
  <Chip {...props} />
))<{ isWriting: boolean }>`
  opacity: ${props => (props.isWriting ? 1 : 0)};
`;

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
}: CombinedProps) => {
  const formatChip = () => {
    if (writers.length === 1) return `${writers[0]} is writing...`;
    if (writers.length <= 3) return `${writers.join(', ')} are writing...`;
    return `${writers.slice(0, 2).join(', ')} and ${
      writers.slice(2).length
    } others are writing...`;
  };

  return (
    <div>
      <ChatListWrapper>
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
      <Grid container={true} style={posRelative}>
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
          autoFocus={true}
          fullWidth={true}
        />
        <PositionedIconButton
          aria-label="select emoji"
          disableRipple={true}
          onClick={toggleEmojiPicker}
        >
          <Icon fontSize="small">insert_emoticon</Icon>
        </PositionedIconButton>
      </Grid>
    </div>
  );
};
