// @flow
import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Visible from '../visible';
import { lighterGray, red } from '../../utils/constants';

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

export const LoadingModal = ({ isLoading }: Props) => (
  <Visible enabled={isLoading}>
    <View style={styles.container}>
      <View style={styles.box}>
        <ActivityIndicator color={red} />
      </View>
    </View>
  </Visible>
);

const mapStateToProps = ({ global: { isLoading } }) => ({ isLoading });
export default connect(mapStateToProps)(LoadingModal);
