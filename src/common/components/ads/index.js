import React from 'react';
import { Image, Dimensions, View } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';

import { connect } from 'react-redux';
import { Ad as AdType, State } from '../../types';
import { darkGray, AD_RATIO } from '../../utils/constants';

const { width } = Dimensions.get('window');

const styles = {
  item: {
    height: width * AD_RATIO,
    width,
  },
};

const CarouseItem = ({ ad }: { ad: AdType }) => (
  <View style={styles.item}>
    <Image
      source={{ uri: ad.fileURL }}
      style={styles.item}
    />
  </View>
);

type Props = {
  ads: AdType[],
};

class Ads extends React.Component<Props> {
  keyExtractor = (it: AdType) => it.id;
  renderItem = ({ item: ad }: { item: AdType }) => (
    <CarouseItem ad={ad} />
  );
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


const mapStateToProps = (state: State) => ({ ads: state.ads });
export default connect(mapStateToProps)(Ads);
