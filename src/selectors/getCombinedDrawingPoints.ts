import { createSelector } from 'reselect';
import {
  State,
  DrawingPoint,
  BroadcastedDrawingPoints,
} from './../store/interfaces';
import { store } from './../store';
import { actions } from './../actions';

const getCache = (state: State) => state.canvas.drawingPointsCache;
const getDrawingPoints = (state: State) => state.canvas.drawingPoints;
const getBroadcastedDrawingPoints = (state: State) =>
  state.canvas.broadcastedDrawingPoints;

export const getCombinedDrawingPoints = createSelector(
  [getDrawingPoints, getBroadcastedDrawingPoints, getCache],
  (drawingPoints, broadcastedDrawingPoints, drawingPointsCache) => {
    const cacheLen = drawingPointsCache.length;
    const combined = calculateCombined(
      drawingPoints,
      broadcastedDrawingPoints,
      drawingPointsCache,
    );

    // set cache and return points over cache length
    const divisor = 10;
    const isNewCacheLengthDifferent =
      Math.floor(cacheLen / divisor) !== Math.floor(combined.length / divisor);

    if (isNewCacheLengthDifferent) {
      const newCacheLen = combined.length - (combined.length % divisor);
      const newCache = combined.slice(0, newCacheLen);

      store.dispatch(actions.canvas.setDrawingPointsCache(newCache));

      return combined.slice(newCacheLen);
    }

    return cacheLen ? combined.slice(cacheLen - 1) : combined;
  },
);

const calculateCombined = (
  drawingPoints: DrawingPoint[][],
  broadcastedDrawingPoints: BroadcastedDrawingPoints,
  drawingPointsCache: DrawingPoint[][],
) => {
  const cacheLen = drawingPointsCache.length;

  console.log('CALC'); // TODO optimize

  const combineIfNoCache = () =>
    Object.values(broadcastedDrawingPoints)
      .reduce((acc, itm) => acc.concat(itm.filter(itm => !!itm)), [])
      .concat(drawingPoints.filter(itm => !!itm))
      .sort((a, b) => a[0].date - b[0].date);

  const combineWithCache = () => {
    const existAndNotCached = (itm: DrawingPoint[]) =>
      !!itm && itm[0].date > drawingPointsCache[cacheLen - 1][0].date;

    const newValues = Object.values(broadcastedDrawingPoints)
      .reduce((acc, itm) => acc.concat(itm.filter(existAndNotCached)), [])
      .concat(drawingPoints.filter(existAndNotCached))
      .sort((a, b) => a[0].date - b[0].date);

    return drawingPointsCache.concat(newValues);
  };

  return cacheLen ? combineWithCache() : combineIfNoCache();
};
