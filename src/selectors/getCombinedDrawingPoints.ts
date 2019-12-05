import { createSelector } from 'reselect';

import {
  State,
  DrawingPoint,
  BroadcastedDrawingPoints,
} from './../store/interfaces';

const getCache = (state: State) => state.canvas.drawingPointsCache;
const getDrawingPoints = (state: State) => state.canvas.drawingPoints;
const getBroadcastedDrawingPoints = (state: State) =>
  state.canvas.broadcastedDrawingPoints;

export const getCombinedDrawingPoints = createSelector(
  [getDrawingPoints, getBroadcastedDrawingPoints, getCache],
  (
    drawingPoints: DrawingPoint[][],
    broadcastedDrawingPoints: BroadcastedDrawingPoints,
    drawingPointsCache: DrawingPoint[][],
  ) => {
    const cacheLen = drawingPointsCache.length;

    const latestBPoints = Object.values(broadcastedDrawingPoints).map(arr => {
      const latestGroup = arr[arr.length - 1];
      return latestGroup[latestGroup.length - 1];
    });

    const latestGroup = drawingPoints[drawingPoints.length - 1];
    const latestDrawingPoint =
      (latestGroup && latestGroup[latestGroup.length - 1]) || undefined;

    latestDrawingPoint && latestBPoints.push(latestDrawingPoint);

    const sortByDate = (a: DrawingPoint[], b: DrawingPoint[]) =>
      a[0].date - b[0].date;

    const combineIfNoCache = () =>
      Object.values(broadcastedDrawingPoints)
        .reduce((acc, itm) => acc.concat(itm), [])
        .concat(drawingPoints)
        .sort(sortByDate);

    const combineWithCache = () => {
      const notCached = (itm: DrawingPoint[]) =>
        itm[0].date > drawingPointsCache[cacheLen - 1][0].date;

      const newValues = Object.values(broadcastedDrawingPoints)
        .reduce((acc, itm) => acc.concat(itm.filter(notCached)), [])
        .concat(drawingPoints.filter(notCached))
        .sort(sortByDate);

      return drawingPointsCache.concat(newValues);
    };

    return cacheLen ? combineWithCache() : combineIfNoCache();
  },
);
