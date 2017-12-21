import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  View,
  Spinner,
} from 'native-base';
import { connect } from 'react-redux';

const styles = {
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    padding: 25,
  },
};

export type Props = {
  isLoading: boolean,
};

export const LoadingModal = ({ isLoading }: Props) => (isLoading ?
  <View style={styles.container}>
    <View style={styles.box}>
      <Spinner color="red" />
    </View>
  </View> : null
);

const mapStateToProps = ({ global: { isLoading } }) => ({ isLoading });
export default connect(mapStateToProps)(LoadingModal);
