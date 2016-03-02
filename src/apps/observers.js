import observeStore from '../client-lib/observe-store';
import { newBundle, fetchBundleError } from './actions';
import * as api from '../client-lib/api';
import RendezvousSocket from '../client-lib/rendezvous-socket';

function runMode(store) {
    let rendezvous;
    let { juttleServiceHost } = store.getState();
    const runModeSelector = state => state.runMode;


    function runModeChanged(runMode) {
        function bundleReceived(bundleId, bundle) {
            return api.describe(juttleServiceHost, bundle)
            .then(inputs => {
                store.dispatch(newBundle(bundleId, bundle, inputs));
            })
            .catch(err => { store.dispatch(fetchBundleError(bundleId, err)) })
        }

        if (rendezvous) {
            rendezvous.close();
        }

        if (runMode.path) {
            api.getBundle(juttleServiceHost, runMode.path)
            .then(res => bundleReceived(runMode.path, res.bundle))
            .catch(err => { store.dispatch(fetchBundleError(runMode.path, err)) })
        } else if (runMode.rendezvous) {
            rendezvous = new RendezvousSocket(`ws://${juttleServiceHost}/rendezvous/${runMode.rendezvous}`);
            rendezvous.on('message', msg => bundleReceived(msg.bundle_id, msg.bundle));
        }
    }

    observeStore(store, runModeSelector, runModeChanged);
}

export default function (store) {
    runMode(store);
}
