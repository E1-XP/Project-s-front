import React, { ComponentType } from 'react';
import { Prompt } from 'react-router-dom';
import './style.scss';

import { Props } from './index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { Canvas } from "../canvas";
import { Chat } from '../chat';

export const RoomComponent: ComponentType<Props> = ({ changeRoomOwner, isUserAdmin,
    handleSubmit, isSocketConnected, setMessage, user, users, rooms, chats, state, match }) => {

    const isLoaded = isSocketConnected && Object.keys(rooms.list).length && match.params.id;

    if (!isLoaded) return <p>loading...</p>;

    return (<main id="room" className="container">
        <Grid container spacing={16}>
            <Grid item md={3} sm={12}>
                <Grid item xs={12} className="mbottom-1" >
                    <Paper className="paper">
                        <Typography variant="headline">
                            Room {rooms.list[match.params.id].name}
                        </Typography>
                        <Typography variant="headline">
                            Currently online: {Object.keys(users.selectedRoom).length}
                        </Typography>
                        <List>
                            {Object.keys(users.selectedRoom)
                                .map(id => (
                                    <ListItem key={id}>
                                        <ListItemText primary={users.general[id]}
                                            secondary={isUserAdmin(Number(id)) && 'admin'} />
                                        {/* {users.selectedRoom[id]}
                            {isUserAdmin(user.id) && !isUserAdmin(Number(id)) &&
                                <span data-id={id}
                                    onClick={changeRoomOwner}>*Set as admin</span>} */}
                                    </ListItem>)
                                )}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className="paper">
                        <Typography variant="headline">
                            Room chat
                    </Typography>
                        <Chat messages={chats.selectedRoom} handleSubmit={handleSubmit} />
                    </Paper>
                </Grid>
            </Grid>
            <Grid item md={9} sm={12}>
                <Paper className="paper">
                    <Canvas />
                </Paper>
            </Grid>
        </Grid>

        <Prompt when={isUserAdmin(user.id)}
            message={'Are you want to leave? This will close your room.'} />
    </main>);
};
