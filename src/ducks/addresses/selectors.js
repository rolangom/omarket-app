// @flow
import type { State } from '../../common/types';

export const getAllAddresses = (state: State) =>
  Object.values(state.addresses.byId);

export default null;
