import { State } from './../store/interfaces';

export const createSelectorWithExposedCache = (
  args: any[],
  resultFn: (...args: any) => any,
) => {
  let cachedArgs: any[] = [];
  let cache: any;
  const isEqual = (args: any[]) =>
    args.every((itm, i) => itm === cachedArgs[i]);

  return (state: State) => {
    if (cache !== undefined && isEqual(args.map(fn => fn(state)))) return cache;

    cachedArgs = args.map(fn => fn(state));
    const result = resultFn(...cachedArgs, cache);
    cache = result;

    return result;
  };
};
