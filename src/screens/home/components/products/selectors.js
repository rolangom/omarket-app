// @flow

import type { State, Product } from '../../../../config/types';

export function getProducts(state: State, category: string): Product[] {
  return category ?
    state.products.filter((it: Product) => it.category === category) :
    [];
}

export default null;
