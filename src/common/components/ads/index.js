import React from 'react';
import { Image, Dimensions, View } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { branch, compose, renderNothing } from 'recompose';

import { connect } from 'react-redux';
import { Ad as AdType, State } from '../../types';
import {darkGray, AD_RATIO, defaultEmptyArr} from '../../utils/constants';
import { visibleIf } from '../visible';

const { width } = Dimensions.get('window');

const styles = {
  item: {
    height: width * AD_RATIO,
    width,
  },
};

const CarouseItem = ({ ad }: { ad: AdType }) => (
  <View style={styles.item}>
    <Image source={{ uri: ad.fileURL }} style={styles.item} />
  </View>
);

type Props = {
  ads: AdType[],
};

class Ads extends React.Component<Props> {
  keyExtractor = (it: AdType) => it.id;
  renderItem = ({ item: ad }: { item: AdType }) => <CarouseItem ad={ad} />;
  render() {
    return (
      <View style={styles.item}>
        <SwiperFlatList
          showPagination
          autoplay
          autoplayLoop
          paginationDefaultColor={darkGray}
          data={this.props.ads}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

Ads.defaultProps = {
  ads: defaultEmptyArr,
};

const mapStateToProps = (state: State) => ({ ads: state.ads });
export default compose(
  connect(mapStateToProps),
  branch(
    (props: Props) => props.ads.length === 0,
    renderNothing,
  ),
)(Ads);
