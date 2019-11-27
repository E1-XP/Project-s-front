import { from, ObservableInput } from 'rxjs';

import { store } from './../store';
import { actions } from './../actions';

interface Response {
  data: any;
  status: number;
}

interface FetchConfig {
  setIsFetching?: boolean;
}

const defaultConfig: FetchConfig = {
  setIsFetching: true,
};

export const fetch$ = (
  url: string,
  method = 'GET',
  data?: any,
  headers?: any,
  config = defaultConfig,
) => {
  const promise = async (
    url: string,
    method: string,
    data?: any,
    headers?: any,
  ) => {
    try {
      if (config.setIsFetching) {
        store.dispatch(actions.global.setIsFetching(true));
      }

      const response = await fetch(url, {
        method,
        headers: headers || {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: data ? JSON.stringify(data) : null,
      });

      const toJSON = await response.json();

      if (response.status === 401) {
        store.dispatch(actions.global.authorizationError());
      }

      return {
        data: toJSON,
        status: response.status,
      };
    } finally {
      if (config.setIsFetching) {
        store.dispatch(actions.global.setIsFetching(false));
      }
    }
  };

  return from<ObservableInput<Response>>(promise(url, method, data, headers));
};
