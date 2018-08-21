import React, { ComponentType } from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { actions } from '../../actions'
import { State, User, Users, RoomsList } from '../../store';

interface Props {
    user: User;
    users: Users;
    rooms: RoomsList;
    initCheckInbox: () => Dispatch;
    setInboxCount: (v?: number) => Dispatch;
}

const hooks = {
    componentDidMount() {
        this.props.initCheckInbox();
        this.props.setInboxCount(0);
    }
};

const InboxComponent: ComponentType<Props> = ({ user, users, rooms }) => {
    return (<div>
        <h2>inbox</h2>
        <ul>
            {user.inboxMessages ?
                (user.inboxMessages.length ?
                    user.inboxMessages.map((itm, i) => <li key={i}>
                        {`${users.general[itm.senderId]} send you invitation link to enter
                         room ${rooms[itm.roomId] ? rooms[itm.roomId].name : '[closed]'}`}
                    </li>) :
                    `you don't received any messages yet`) :
                'loading...'}
        </ul>
    </div>)
};

const mapStateToProps = ({ user, users, rooms }: State) => ({
    user,
    users,
    rooms: rooms.list
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initCheckInbox: () => dispatch(actions.user.initCheckInbox()),
    setInboxCount: (v?: number) => dispatch(actions.global.setInboxCount(v))
});

export const Inbox = compose(
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle<Props, {}>(hooks)
)(InboxComponent);
