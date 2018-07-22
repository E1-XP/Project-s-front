import React from 'react';
import { Provider } from 'react-redux'
import { ConnectedRouter } from "connected-react-router"

import { store } from './store';
import { routes } from './routes';
import { history } from './history';

export const App = (props: any) => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                {routes}
            </ConnectedRouter>
        </Provider>
    );
};

document.body.style.backgroundColor = '#555';
document.body.style.color = '#eee';
