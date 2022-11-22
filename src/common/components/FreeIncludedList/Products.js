// @flow
import { connect } from 'react-redux';
import { compose, branch, renderNothing } from 'recompose';
import { FreeIncluded } from '.';
import type { Offer, State } from '../../types';
import { isOfferFreeIncluded } from '../../utils';

type Props = {
  offer: Offer,
};

const mapStateToProps = (state: State, { offer }: Props) => ({
  items: offer.products.map(it => ({
    ...it,
    product: state.products.byId[it.productId],
  })),
});

const enhance = compose(
  branch((props: Props) => !isOfferFreeIncluded(props.offer), renderNothing),
  connect(mapStateToProps),
);

export default enhance(FreeIncluded);
