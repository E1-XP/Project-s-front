import React, { ComponentType } from 'react';
import './style.scss';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { Props, PassedProps } from './index';

export const ChatComponent: ComponentType<Props & PassedProps> = ({ state,
    setMessage, messages, handleMessageSubmit }) => {

    return (<div id="chat">
        <List className="list--chat">
            {messages.length ?
                messages.map((itm, i) =>
                    <ListItem key={i}>
                        <Avatar>
                            <Icon>account_circle</Icon>
                        </Avatar>
                        <ListItemText primary={itm.author} secondary={itm.message} className="text--wordbreak" />
                    </ListItem>)
                : <ListItem>No Messages found. Write the first one!</ListItem>}
        </List>
        <TextField multiline rows="1" rowsMax="5" placeholder="Type here..." margin="normal"
            value={state} onChange={setMessage} className="textfield--fullwidth" />
        <Button variant="fab" mini color="secondary" aria-label="Send" onClick={handleMessageSubmit}>
            <Icon>done</Icon>
        </Button>
    </div>)
};