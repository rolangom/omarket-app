// @flow
import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { lighterGray, red } from '../../../config/constants';

const styles = {
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: lighterGray,
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
      <ActivityIndicator color={red} />
    </View>
  </View> : null
);

const mapStateToProps = ({ global: { isLoading } }) => ({ isLoading });
export default connect(mapStateToProps)(LoadingModal);
