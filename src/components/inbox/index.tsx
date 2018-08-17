import React, { ComponentType } from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { actions } from '../../actions'
import { State, User, Users } from '../../store';

interface Props {
    user: User;
    users: Users;
    initCheckInbox: () => Dispatch;
    setInboxCount: (v?: number) => Dispatch;
}

const hooks = {
    componentDidMount() {
        this.props.initCheckInbox();
        this.props.setInboxCount(0);
    }
};

const InboxComponent: ComponentType<Props> = ({ user, users }) => {
    return (<div>
        <h2>inbox</h2>
        <ul>
            {user.inboxMessages ?
                (user.inboxMessages.length ?
                    user.inboxMessages.map((itm, i) => <li key={i}>
                        {`${users.general[itm.senderId]} send you invitation to enter ${itm.roomId} room`}
                    </li>) :
                    `you don't received any messages yet`) :
                'loading...'}
        </ul>
    </div>)
};

const mapStateToProps = ({ user, users }: State) => ({
    user,
    users
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initCheckInbox: () => dispatch(actions.user.initCheckInbox()),
    setInboxCount: (v?: number) => dispatch(actions.global.setInboxCount(v))
});

export const Inbox = compose(
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle<Props, {}>(hooks)
)(InboxComponent);
