// @flow
import * as React from 'react';
import { MapView } from 'expo';
import { View, StyleSheet } from 'react-native';
import type { Location } from '../../types';
import { mainCityLocation } from '../../utils/constants';
import Visible from '../visible';

type Props = {
  location?: ?Location,
};

const styles = {
  main: {
    height: 200,
  },
  flex1: {
    flex: 1,
  },
};

const latitudeDelta = 0.002; // 0.0057625;
const longitudeDelta = 0.001; // 0.00263125;

const MapPlaceholder = ({ location }: Props) => {
  const theLocation = location || mainCityLocation;
  return (
    <Visible enabled={!!(location && location.latitude)}>
      <View style={styles.main}>
        <MapView
          style={styles.flex1}
          region={{
            ...theLocation,
            latitudeDelta,
            longitudeDelta,
          }}
        >
          <MapView.Marker coordinate={theLocation} />
        </MapView>
        <View style={StyleSheet.absoluteFillObject} />
      </View>
    </Visible>
  );
};

MapPlaceholder.defaultProps = {
  location: mainCityLocation,
};

export default MapPlaceholder;
