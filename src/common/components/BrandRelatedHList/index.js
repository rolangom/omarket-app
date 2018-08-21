// @flow
import { connect } from 'react-redux';
import HProdList from '../HProdList';
import type { Props } from '../HorizProductList';
import { defaultEmptyArr } from '../../utils/constants';
import type { State } from '../../types';
import { getBrandRelatedProducts } from '../../../ducks/products/selectors';

const mapStateToProps = (state: State, { productId }: Props) => ({
  title: 'De la misma marca',
  items: productId
    ? getBrandRelatedProducts(productId, state)
    : defaultEmptyArr,
});

export default connect(mapStateToProps)(HProdList);
