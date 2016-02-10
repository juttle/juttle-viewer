import observeStore from '../client-lib/observe-store';
import { newBundle, fetchBundleError } from './actions';
import * as api from '../client-lib/api';
import RendezvousSocket from '../client-lib/rendezvous-socket';

function runMode(store) {
    let rendezvous;
    let { juttleServiceHost } = store.getState();
    const runModeSelector = state => state.runMode;


    function runModeChanged(runMode) {
        function bundleReceived(bundle) {
            return api.describe(juttleServiceHost, bundle)
            .then(inputs => {
                store.dispatch(newBundle(bundle, inputs));
            })
            .catch(err => { store.dispatch(fetchBundleError(err)) })
        }

        if (rendezvous) {
            rendezvous.close();
        }

        if (runMode.path) {
            api.getBundle(juttleServiceHost, runMode.path)
            .then(res => bundleReceived(res.bundle))
            .catch(err => { store.dispatch(fetchBundleError(err)) })
        } else if (runMode.rendezvous) {
            rendezvous = new RendezvousSocket(`ws://${juttleServiceHost}/rendezvous/${runMode.rendezvous}`);
            rendezvous.on('message', msg => bundleReceived(msg.bundle));
        }
    }

    observeStore(store, runModeSelector, runModeChanged);
}

export default function (store) {
    runMode(store);
}
