import observeStore from '../client-lib/observe-store';
import { promulgateBundle } from './actions';
import * as api from '../client-lib/api';
import RendezvousSocket from '../client-lib/rendezvous-socket';

function runMode(store) {
    let rendezvous;
    let { juttleServiceHost } = store.getState();
    const runModeSelector = state => state.runMode;


    function runModeChanged(runMode) {
        function bundleReceived(bundleId, bundle) {
            return promulgateBundle(bundle, bundleId, juttleServiceHost, store.dispatch.bind(store));
        }

        if (rendezvous) {
            rendezvous.close();
        }

        if (runMode.path) {
            api.getBundle(juttleServiceHost, runMode.path)
            .then(res => bundleReceived(runMode.path, res.bundle));
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
