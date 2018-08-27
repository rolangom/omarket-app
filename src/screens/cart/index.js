// @flow
import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import { Container, Content, List, Button, Text, View } from 'native-base';

import CartListItem from './components/list-item';
import PriceView, { CondPriceView } from '../../common/components/price-view';
import Ads from '../../common/components/ads';
import Link from '../../common/components/link';
import type { CartItem, State } from '../../common/types';
import {
  getCartItems,
  getCartItemsSubTotalPrice,
  getCartTaxTotal,
} from '../../ducks/cart/selectors';
import { changeCartProductQty, changeCartProductDescr } from '../../ducks/cart';
import Prompt from '../../libs/react-native-prompt';
import ArchiveView from './components/ArchiveView';
import ExpressSwitch from './components/ExpressSwitch';
import UsePointsSwitch from './components/UsePointsSwitch';

export type Props = {
  currency: string,
  items: CartItem,
  subTotal: number,
  taxTotal: number,
  usePoints: boolean,
  points: number,
  lastProdIdAdded: ?string,
  onChangeQty: (string, number) => void,
  onChangeDescr: (string, string) => void,
  onContinueShopping: () => void,
};

type CompState = {
  editingProdID: string,
};

const styles = {
  list: {
    paddingTop: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 25,
  },
};

class CartScreen extends React.Component<Props, CompState> {
  state = { editingProdID: null };
  onEditPress = (editingProdID: string) => this.setState({ editingProdID });
  onCancelPrompt = () => this.onEditPress(null);
  onSubmitPrompt = (descr: string) => {
    this.props.onChangeDescr(this.state.editingProdID, descr);
    this.onCancelPrompt();
  };
  renderItem = (item: CartItem) => (
    <CartListItem
      key={item.productID}
      item={item}
      productId={item.productID}
      onChange={this.props.onChangeQty}
      onEditPress={this.onEditPress}
    />
  );
  render() {
    const {
      items,
      subTotal,
      taxTotal,
      onContinueShopping,
      currency,
      usePoints,
      points,
    } = this.props;
    const { editingProdID } = this.state;
    const discounts = usePoints && subTotal > points ? points : 0;
    return (
      <Container>
        <Content whiteBackground>
          <Ads visible forceLoad={false} />
          <List
            dataArray={items}
            renderRow={this.renderItem}
            style={styles.list}
          />
          <ExpressSwitch />
          <UsePointsSwitch visible={subTotal > points && points > 0} />
          <PriceView
            value={subTotal}
            currency={currency}
          />
          <CondPriceView
            visible={discounts > 0}
            value={discounts}
            currency={`- Desc. ${currency}`}
          />
          <PriceView
            value={taxTotal}
            currency={`ITBIS ${currency}`}
          />
          <PriceView
            value={(subTotal - discounts) + taxTotal}
            currency={`TOTAL ${currency}`}
          />
          <View style={styles.buttons}>
            <Link
              component={Button}
              light
              disabled={items.length <= 0}
              to="OrderRequest"
            >
              <Text>Terminar</Text>
            </Link>
            <Button primary onPress={onContinueShopping}>
              <Text>Continuar comprando</Text>
            </Button>
          </View>
          <ArchiveView disabled={items.length <= 0} />
        </Content>
        <Prompt
          title="Nota adicional"
          visible={!!editingProdID}
          onCancel={this.onCancelPrompt}
          onSubmit={this.onSubmitPrompt}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state: State, { navigation }): Props => ({
  currency: state.global.currency,
  usePoints: state.global.usePoints,
  points: (state.user && state.user.points) || 0,
  items: getCartItems(state),
  taxTotal: getCartTaxTotal(state),
  subTotal:
    getCartItemsSubTotalPrice(state) +
    (state.global.isRushOrder ? parseFloat(state.global.rushPrice) : 0),
  lastProdIdAdded: state.global.lastProdIdAdded,
  onContinueShopping: () => {
    const actionToDispatch = NavigationActions.navigate({
      routeName: 'Start',
      action: StackActions.popToTop(),
    });
    navigation.dispatch(actionToDispatch);
  },
});

const mapDispatchToProps = dispatch => ({
  onChangeQty: (id: string, qty: number) =>
    dispatch(changeCartProductQty(id, qty)),
  onChangeDescr: (id: string, descr: string) =>
    dispatch(changeCartProductDescr(id, descr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

/*

 */
