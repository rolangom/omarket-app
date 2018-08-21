import { createNavigationReducer } from 'react-navigation-redux-helpers';
import AppNavigator from './app-navigator';

const navReducer = createNavigationReducer(AppNavigator);

export default navReducer;
