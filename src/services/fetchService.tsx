import { from } from 'rxjs';

interface Response {
  data: any;
  status: number;
}

export const fetchStreamService = (
  url: string,
  method = 'GET',
  data?: any,
  headers?: any,
) => {
  const promise = async (
    url: string,
    method: string,
    data?: any,
    headers?: any,
  ) => {
    try {
      const response = await fetch(url, {
        method,
        headers: headers || {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: data ? JSON.stringify(data) : null,
      });

      const toJSON = await response.json();

      return {
        data: toJSON,
        status: response.status,
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  return from<Response>(promise(url, method, data, headers));
};
