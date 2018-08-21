import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import RootNavigator from './app-navigator';

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const AppNavigator = reduxifyNavigator(RootNavigator, 'root');

export { AppNavigator, middleware };
