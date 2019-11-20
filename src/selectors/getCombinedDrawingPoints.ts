import { State, DrawingPoint } from './../store/interfaces';
import { store } from './../store';

import { createSelectorWithExposedCache as createSelector } from './../utils/createSelector';

const getCache = (state: State) => state.canvas.drawingPointsCache;
const getDrawingPoints = (state: State) => state.canvas.drawingPoints;
const getBroadcastedDrawingPoints = (state: State) =>
  state.canvas.broadcastedDrawingPoints;
const getCurrentDrawing = (state: State) => state.canvas.currentDrawing;

export const getCombinedDrawingPoints = createSelector(
  [getDrawingPoints, getBroadcastedDrawingPoints, getCache, getCurrentDrawing],
  (
    drawingPoints,
    broadcastedDrawingPoints,
    drawingPointsCache,
    currentDrawing,
    cache,
  ) => {
    const { latestPoint } = store.getState().canvas;
    const cacheLen = drawingPointsCache.length;

    const latestValues = Object.values<DrawingPoint[][]>(
      broadcastedDrawingPoints,
    ).map(arr => {
      const latestGroup = arr[arr.length - 1];
      return latestGroup[latestGroup.length - 1];
    });

    const latestGroup = drawingPoints[drawingPoints.length - 1];
    const latestDrawingPoint =
      (latestGroup && latestGroup[latestGroup.length - 1]) || undefined;
    latestDrawingPoint && latestValues.push(latestDrawingPoint);

    const combineIfNoCache = () =>
      Object.values<DrawingPoint[][]>(broadcastedDrawingPoints)
        .reduce((acc, itm) => acc.concat(itm), [])
        .concat(drawingPoints)
        .sort((a, b) => a[0].date - b[0].date);

    const combineWithCache = () => {
      const notCached = (itm: DrawingPoint[]) =>
        itm[0].date > drawingPointsCache[cacheLen - 1][0].date;

      const newValues = Object.values<DrawingPoint[][]>(
        broadcastedDrawingPoints,
      )
        .reduce((acc, itm) => acc.concat(itm.filter(notCached)), [])
        .concat(drawingPoints.filter(notCached))
        .sort((a, b) => a[0].date - b[0].date);

      return drawingPointsCache.concat(newValues);
    };

    if (
      cache &&
      cache.length &&
      latestPoint &&
      currentDrawing === cache[0][0].drawingId &&
      latestValues.length &&
      latestValues.every(({ date }) => date <= latestPoint.date)
    ) {
      const lastGroup = cache[cache.length - 1];
      if (
        lastGroup[0].group !== latestPoint.group ||
        lastGroup[0].userId !== latestPoint.userId
      ) {
        cache.push([latestPoint]);
      } else lastGroup.push(latestPoint);

      return cache;
    }

    return cacheLen ? combineWithCache() : combineIfNoCache();
  },
);
