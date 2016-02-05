import { UPDATE_LOCATION } from 'react-router-redux';

import { newBundle, fetchBundleError } from './actions';
import * as api from '../client-lib/api';
import RendezvousSocket from '../client-lib/rendezvous-socket';

export const bundleMiddleware = store => {
    let rendezvous;
    let { juttleServiceHost } = store.getState();

    function bundleReceived(bundle) {
        return api.describe(juttleServiceHost, bundle)
        .then(inputs => {
            store.dispatch(newBundle(bundle, inputs));
        })
    }

    function runModeChanged(runMode) {
        if (rendezvous) {
            rendezvous.close();
        }

        if (runMode.path) {
            api.getBundle(juttleServiceHost, runMode.path)
            .then(res => { bundleReceived(res.bundle) })
            .catch(err => { store.dispatch(fetchBundleError(err)) })
        } else if (runMode.rendezvous) {

            rendezvous = new RendezvousSocket(`ws://${juttleServiceHost}/rendezvous/${runMode.rendezvous}`);
            rendezvous.on('message', msg => bundleReceived(msg.bundle));
        }
    }

    runModeChanged(store.getState().runMode);

    return next => action => {
        // only update if prevRunMode is different from newRunMode
        if (action.type !== UPDATE_LOCATION) {
            return next(action);
        }

        let prevRunMode = store.getState().runMode;
        let result =  next(action);
        let newRunMode = store.getState().runMode;
        if (newRunMode.path !== prevRunMode.path
            || newRunMode.rendezvous !== prevRunMode.rendezvous) {

            runModeChanged(newRunMode);
        }

        return result;
    }
}
