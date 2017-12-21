import React from 'react';
import { Image, Dimensions, View } from 'react-native';
import Swiper from 'react-native-swiper';

import { connect } from 'react-redux';
import { fetchAds } from '../../../ducks/ads/index';
import { Ad as AdType } from '../../../config/types';

const { width } = Dimensions.get('window');
const height = 200;

const styles = {
  item: {
    height,
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
  forceLoad: boolean,
  visible?: boolean,
  loadAds: () => void,
};

class Ads extends React.Component<Props> {
  // componentDidMount() {
  //   this.props.visible && this.props.loadAds();
  // }
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
        >
          {this.props.ads.map(this.renderItem)}
        </Swiper>
      </View>
    );
  }
}


const mapStateToProps = state => ({ ads: state.ads });
const mapDispatchToProps = (dispatch, { forceLoad }: Props) => ({
  // loadAds: () => dispatch(fetchAds(forceLoad)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Ads);
