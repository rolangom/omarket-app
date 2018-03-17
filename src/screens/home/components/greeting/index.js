// @flow
import * as React from 'react';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import Visible from '../../../../common/components/visible';
import type { State } from '../../../../common/types';

export type Props = {
  enabled: boolean,
  userName: ?string,
};

const styles = {
  greeting: {
    padding: 5,
    textAlign: 'right',
  },
};

const Greeting = ({ enabled, userName }: Props) => (
  <Visible enabled={enabled && userName}>
    <Text style={styles.greeting}>Saludos {userName}</Text>
  </Visible>
);

const mapStateToProps = (state: State) => ({
  userName: state.user && state.user.displayName,
});
export default connect(mapStateToProps)(Greeting);
