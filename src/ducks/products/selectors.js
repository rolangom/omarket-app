// @flow

import type { State, Product } from '../../common/types';

export function getProducts(state: State, category: string): Product[] {
  const allProducts: Product[] =
    state
      .products
      .allIds
      .map((id: string) => state.products.byId[id]);
  return category ?
    allProducts
      .filter((it: Product) => it.category === category)
    : [];
}

export default null;
