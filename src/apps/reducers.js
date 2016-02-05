import { UPDATE_LOCATION } from 'react-router-redux';
import { combineReducers } from 'redux';
import { NEW_BUNDLE, NEW_ERROR, FETCH_BUNDLE_ERROR } from './actions';

function runMode(state = { path: null, rendezvous: null }, action) {
    if (action.type === UPDATE_LOCATION) {
        let { query } = action.payload;

        if (query.path) {
            return {
                path: query.path,
                rendezvous: null
            }
        } else if (query.rendezvous){
            return {
                path: null,
                rendezvous: query.rendezvous
            }
        }
    }

    return state;
}

const defaultBundleInfo = {
    bundle: null,
    inputs: null,
    error: null
};

function bundleInfo(state = defaultBundleInfo, action) {
    switch (action.type) {
        case NEW_BUNDLE:
            return {
                bundle: action.bundle,
                inputs: action.inputs,
                error: null
            }
        case NEW_ERROR:
            return Object.assign({}, state, {
                error: action.error
            });
        case FETCH_BUNDLE_ERROR:
            return {
                bundle: null,
                inputs: null,
                error: action.error
            };
        default:
            return state;
    }
}

// don't support the ability to change juttleEngineHosts, but this may
// be done in the future. Either way we want to put this in the store,
// the actual values on provided on store init.
function juttleEngineHost(state = null) {
    return state
}

const reducers = combineReducers({
    runMode,
    bundleInfo,
    juttleEngineHost
});

export default reducers;
