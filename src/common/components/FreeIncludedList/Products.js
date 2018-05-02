// @flow
import { connect } from 'react-redux';
import { FreeIncluded } from '.';
import type { Offer, State } from '../../types';

type Props = {
  offer: Offer,
};

const mapStateToProps = (state: State, { offer }: Props) => ({
  items: offer.products.map(it => ({
    ...it,
    product: state.products.byId[it.productId],
  })),
});
export default connect(mapStateToProps)(FreeIncluded);
