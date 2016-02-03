export const NEW_BUNDLE = 'NEW_BUNDLE';
export const NEW_ERROR = 'NEW_ERROR';
export const FETCH_BUNDLE_ERROR = 'FETCH_BUNDLE_ERROR';

export function newBundle(bundle, inputs) {
    return {
        type: NEW_BUNDLE,
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
