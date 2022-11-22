// @flow
import * as React from 'react';
import { compose, mapProps, flattenProp } from 'recompose';
import { H1, H3, Text, Button, View } from 'native-base';
import OptImage from 'src/common/components/opt-image';
import type { Product } from 'src/common/types';
import { centered, row, paddingM } from 'src/common/utils/styles';
import { getPriceWithTax } from 'src/common/utils';
import type { Offer } from 'src/common/types';

type Props = Product & {
  product: Product,
  offer: Offer,
  width: number,
  imgStyle: Object,
  onAdd(): void,
  onContinue(): void,
};

const RelatedProductDetail = (props: Props) => (
  <View>
    <OptImage
      uri={props.fileURL}
      size={props.width}
      imgStyle={props.imgStyle}
    />
    <View style={[centered, paddingM]}>
      <H3>{props.title}</H3>
      <H3>{props.descr}</H3>
      <H1 primary bold>{props.price}</H1>
    </View>
    <View style={row}>
      <Button
        warning
        full
        flex1
        roundedBorderLeftBottom
        onPress={props.onContinue}
      >
        <Text>No</Text>
      </Button>
      <Button
        primary
        full
        flex1
        roundedBorderRightBottom
        onPress={props.onAdd}
      >
        <Text>Sí</Text>
      </Button>
    </View>
  </View>
);

const enhance = compose(
  flattenProp('product'),
  mapProps((props: Props) => ({
    ...props,
    title: props.offer ? props.offer.title : props.name,
    price: getPriceWithTax(props.price, props.taxFactor, props.offer, '$'),
  })),
);

export default enhance(RelatedProductDetail);
