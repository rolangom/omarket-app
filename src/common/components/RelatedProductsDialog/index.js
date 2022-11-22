// @flow
import * as React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet, Modal } from 'react-native';
import { H3, H2, View } from 'native-base';
import { NavigationActions, StackActions } from 'react-navigation';
import { getOneRelatedProduct } from 'src/ducks/products/selectors';
import type { Product, State, Offer } from '../../types';
import { setShowRelatedProdId } from 'src/ducks/global';
import { incrCartProduct } from 'src/ducks/cart';
import RelatedProductDetail from './components/Detail';
import {defaultEmptyArr, defaultEmptyObj} from "../../utils/constants";
import { padXS, padXXL, padL } from "../../utils/styles";

type Props = {
  orgProduct: Product,
  product: Product,
  offer?: ?Offer,
  offerId?: ?string,
  visible: boolean,
  onAccept: () => void,
  onCancel: () => void,
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF99',
    padding: padXXL,
  },
  content: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowRadius: padL,
    borderRadius: padL,
  },
  centerContent: {
    padding: padL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width - (padXXL * 2),
    height: (width - (padXXL * 2)) * 0.75,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: padXXL,
  },
});

const RelatedProductsDialog = ({
  orgProduct,
  product,
  offer,
  visible,
  onAccept,
  onCancel,
}: Props) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={console.log}
  >
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.centerContent}>
          <H3>Vemos que has ordenado</H3>
          <H2 bold>{orgProduct.name}</H2>
          <H3>Deseas agregar:</H3>
        </View>
        <RelatedProductDetail
          product={product}
          offer={offer}
          onAdd={onAccept}
          onContinue={onCancel}
          imgStyle={styles.image}
          width={styles.image.width}
        />
      </View>
    </View>
  </Modal>
);

RelatedProductsDialog.defaultProps = {
  orgProduct: defaultEmptyObj,
};

const mapStateToProps = (state: State): Props => {
  const { showRelatedProdId } = state.global;
  const [offerId] = state.offers.rel[showRelatedProdId] || defaultEmptyArr;
  return ({
    visible: !!(showRelatedProdId),
    orgProduct: state.products.byId[showRelatedProdId],
    product: !!(showRelatedProdId)
      ? getOneRelatedProduct(showRelatedProdId, state)
      : null,
    offerId,
    offer: state.offers.byId[offerId],
  });
};
const mapDispatchToProps = (dispatch: Dispatch): Props => ({
  onAccept: (product, offerId) => {
    dispatch(incrCartProduct(product.id, offerId));
    // dispatch(NavigationActions.navigate({ routeName: 'Cart' }));
    dispatch(setShowRelatedProdId(null));
  },
  onCancel: () => {
    // const navigateAction = NavigationActions.navigate({
    //   routeName: 'Start',
    //   action: StackActions.popToTop(),
    // });
    // dispatch(navigateAction);
    dispatch(setShowRelatedProdId(null));
  },
});

const mergeProps = (stateProps: Props, dispatchProps: Props, ownsProps: Props): Props => ({
  ...ownsProps,
  ...stateProps,
  ...dispatchProps,
  onAccept: () => dispatchProps.onAccept(stateProps.product, stateProps.offerId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(RelatedProductsDialog);
