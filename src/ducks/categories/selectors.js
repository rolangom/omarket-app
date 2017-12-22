// @flow
import type { Category, State } from '../../config/types';

export function getCategories(state: State, parent: string): Array<Category> {
  const allCategories =
    state
      .categories
      .allIds
      .map((id: string) => state.categories.byId[id]);
  const filterFn = parent ?
    (it: Category) => it.parent === parent
    : (it: Category) => !it.parent;
  return allCategories.filter(filterFn);
}

export default null;
