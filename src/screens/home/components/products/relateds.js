// @flow
import { connect } from 'react-redux';
import { getRelatedProducts } from '../../../../ducks/products/selectors';
import type { Product, State } from '../../../../common/types';
import { defaultEmptyArr } from '../../../../common/utils/constants';
import ProductList from '.';
import { visibleIf } from '../../../../common/components/visible';

export type Props = {
  productId: string,
  items: Product[],
  visible: boolean,
};

const mapStateToProps = (state: State, { productId }: Props): Props => ({
  items: productId ? getRelatedProducts(productId, state) : defaultEmptyArr,
});

export default connect(mapStateToProps)(visibleIf(ProductList));
