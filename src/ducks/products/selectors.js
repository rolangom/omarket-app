// @flow

import type { State, Product } from '../../common/types';
import { isFilterActive } from '../global/selectors';

export function getProducts(state: State, category: string): Product[] {
  const allProducts: Product[] = state.products.allIds.map(
    (id: string) => state.products.byId[id],
  );
  const isPropFiltered = isFilterActive(state);
  return category
    ? allProducts.filter((it: Product) => it.category === category)
    : isPropFiltered
      ? allProducts.filter(
          (it: Product) =>
            (it.contents && it.contents.includes(state.global.filters.contents)) ||
            (it.usefulAs && it.usefulAs.includes(state.global.filters.utilities)),
        )
      : [];
}

export function getRelatedProducts(prodId: string, state: State): Product[] {
  const product: Product = state.products.byId[prodId];
  const relatedProdsId: string[] = Object.keys(product.relatedProds);
  return relatedProdsId.reduce((acc: Product[], pid: string) => {
    const prod: ?Product = state.products.byId[pid];
    if (prod) acc.push(prod);
    return acc;
  }, []);
}

export default null;
