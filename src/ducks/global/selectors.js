// @flow
import { State } from '../../common/types';

export const isFilterActive = (state: State) =>
  state.global.filters.contents !== null ||
  state.global.filters.utilities != null;

export default null;
