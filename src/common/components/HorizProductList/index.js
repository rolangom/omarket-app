// @flow
import { connect } from 'react-redux';
import { getRelatedProducts } from '../../../ducks/products/selectors';
import type { Product, State } from '../../types';
import { defaultEmptyArr } from '../../utils/constants';
import HProdList from '../HProdList';
import { visibleIf } from '../visible';

export type Props = {
  productId: string,
  items: Product[],
  title: string,
  visible: boolean,
};

const mapStateToProps = (state: State, { productId }: Props) => ({
  items: productId ? getRelatedProducts(productId, state) : defaultEmptyArr,
  title: 'También te podrían interesar',
});

export default connect(mapStateToProps)(visibleIf(HProdList));
