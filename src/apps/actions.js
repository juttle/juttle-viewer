export const NEW_BUNDLE = 'NEW_BUNDLE';
export const NEW_ERROR = 'NEW_ERROR';
export const FETCH_BUNDLE_ERROR = 'FETCH_BUNDLE_ERROR';
import * as api from '../client-lib/api';

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

export function fetchBundleError(bundleId, error, bundle) {
    return {
        type: FETCH_BUNDLE_ERROR,
        bundleId,
        bundle,
        error
    };
}

export function promulgateBundle(bundle, bundleId) {
    return (dispatch, getState) => {
        const { juttleServiceHost } = getState();
        if (!bundle.program) {
            return dispatch(newBundle(bundleId, bundle, []));
        }

        return api.describe(juttleServiceHost, bundle)
        .then(inputs => {
            dispatch(newBundle(bundleId, bundle, inputs));
        })
        .catch(err => {
            dispatch(fetchBundleError(bundleId, err, bundle));
        });
    };
}
