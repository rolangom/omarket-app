// @flow

import type { State } from '../../common/types';

export const isUserLogged = (state: State): boolean => !!state.user;

const isMonthAndDayEq = (d1: Date, d2: Date): boolean => (
  console.log('isMonthAndDayEq', d1.getMonth(), d2.getMonth(), d1.getDate(), d2.getDate()),
  d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
);

export const isTodayUserBirthday = (state: State): boolean => !!(
  state.user &&
  state.user.birthday &&
  isMonthAndDayEq(new Date(`${state.user.birthday}T00:00:00-04:00`), new Date())
);


export const getUserGender = (state: State): string =>
  (!!state.user)
    ? state.user.gender
    : 'all';

export default null;
