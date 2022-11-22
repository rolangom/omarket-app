// @flow

import * as React from "react";
import {connect} from "react-redux";

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }

    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}


export function unmountWhenInvisible(WrappedComponent, screenName) {
    const mapStateToFeedProps = (state) => ({
        screenVisible: getCurrentRouteName(state.nav) === screenName,
    });

    const wrapper = (props) => {
        if (props.screenVisible) {
            return <WrappedComponent/>
        }
        return null;
    };


    return connect(mapStateToFeedProps)(wrapper)
}