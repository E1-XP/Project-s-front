import { BehaviorSubject } from 'rxjs';

export const isRoomLinkParamIncludedInLastRoute = new BehaviorSubject(false);
export const isRoomPasswordCheckedAndValid = new BehaviorSubject<
  null | boolean
>(null);

export const currentDrawingOnRoomEnter = new BehaviorSubject<null | number>(
  null,
);
