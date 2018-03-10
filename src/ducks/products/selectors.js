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

export function getRelatedProducts(prodId: string, state: State): Product[] {
  const product: Product = state.products.byId[prodId];
  const relatedProdsId: string[] = Object.keys(product.relatedProds);
  return relatedProdsId.map(pid => state.products.byId[pid]);
}

export default null;
