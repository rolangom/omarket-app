// @flow
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { MapView as Map } from 'expo';
import type { MapRegion } from '../../types';
import { mainCityLocation } from '../../utils/constants';

type Location = {
  latitude: number,
  longitude: number,
};

type Props = {
  location: Location,
  onChange: Location => void,
};

const { Marker } = Map;

const LAT_DELTA = 0.002; // 0.0057625;
const LNG_DELTA = 0.001; // 0.00263125;

class MapView extends React.Component<Props> {
  mapRef: Map = null;
  setMapRef = (ref: React.Node) => {
    this.mapRef = ref;
  };
  onRegionChangeComplete = ({ latitude, longitude }: MapRegion) => {
    const location = {
      latitude,
      longitude,
    };
    this.props.onChange(location);
  };
  setLocation = (location: Location) =>
    this.mapRef.animateToCoordinate(location, 1);

  render() {
    const { location } = this.props;
    const theLocation =
      location && location.latitude ? location : mainCityLocation;
    return (
      <Map
        style={StyleSheet.absoluteFillObject}
        ref={this.setMapRef}
        initialRegion={{
          latitude: theLocation.latitude,
          longitude: theLocation.longitude,
          latitudeDelta: LAT_DELTA,
          longitudeDelta: LNG_DELTA,
        }}
        onRegionChangeComplete={this.onRegionChangeComplete}
      >
        <Marker coordinate={theLocation} />
      </Map>
    );
  }
}

MapView.defaultProps = {
  location: mainCityLocation,
};

export default MapView;
