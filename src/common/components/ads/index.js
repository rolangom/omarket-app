import React from 'react';
import { Image, Dimensions, View } from 'react-native';
import Swiper from 'react-native-swiper';

import { connect } from 'react-redux';
import { Ad as AdType } from '../../types';
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
  visible?: boolean,
};

class Ads extends React.Component<Props> {
  renderItem = (ad: AdType) => (
    <CarouseItem
      key={ad.id}
      ad={ad}
    />
  );
  render() {
    return (this.props.visible &&
      <View style={styles.item}>
        <Swiper
          showsPagination
          autoPlay
          activeDotColor={darkGray}
        >
          {this.props.ads.map(this.renderItem)}
        </Swiper>
      </View>
    );
  }
}


const mapStateToProps = state => ({ ads: state.ads });
export default connect(mapStateToProps)(Ads);
