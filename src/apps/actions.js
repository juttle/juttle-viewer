import * as api from '../client-lib/api';

export const NEW_BUNDLE = 'NEW_BUNDLE';
export const UPDATE_BUNDLE = 'UPDATE_BUNDLE';
export const NEW_ERROR = 'NEW_ERROR';
export const FETCH_BUNDLE_ERROR = 'FETCH_BUNDLE_ERROR';

export function refetchPathBundle() {
    return (dispatch, getState) => {
        let { juttleServiceHost, runMode } = getState();

        if (runMode.path) {
            api.getBundle(juttleServiceHost, runMode.path)
            .then((res) => {
                dispatch({
                    type: UPDATE_BUNDLE,
                    bundle: res.bundle
                });
            })
            .catch((err) => {
                dispatch(newError(err));
            });
        }
    }
}

export function newBundle(bundleId, bundle, inputs) {
    return {
        type: NEW_BUNDLE,
        bundleId,
        bundle,
        inputs
    };
}

export function newError(error) {
    return {
        type: NEW_ERROR,
        error
    };
}

export function fetchBundleError(error) {
    return {
        type: FETCH_BUNDLE_ERROR,
        error
    };
}
