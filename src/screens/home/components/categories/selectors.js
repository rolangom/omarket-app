// @flow
import type { Category, State } from '../../../../config/types';

export function getCategories(state: State, parent: string): Array<Category> {
  return parent ?
    state.categories.filter((it: Category) => it.parent === parent)
    : state.categories.filter((it: Category) => !it.parent);
}


export default null;
