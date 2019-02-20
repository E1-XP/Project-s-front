import { BehaviorSubject } from 'rxjs';

export const isRoomLinkParamIncludedInLastRoute = new BehaviorSubject(false);
export const isRoomPasswordCheckedAndValid = new BehaviorSubject<
  null | boolean
>(null);
