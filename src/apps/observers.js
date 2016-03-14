import observeStore from '../client-lib/observe-store';
import { promulgateBundle } from './actions';
import * as api from '../client-lib/api';
import RendezvousSocket from '../client-lib/rendezvous-socket';

function runMode(store) {
    let rendezvous;
    let { juttleServiceHost } = store.getState();
    const runModeSelector = state => state.runMode;


    function runModeChanged(runMode) {
        if (rendezvous) {
            rendezvous.close();
        }

        if (runMode.path) {
            api.getBundle(juttleServiceHost, runMode.path)
            .then(res => store.dispatch(promulgateBundle(res.bundle, runMode.path)));
        } else if (runMode.rendezvous) {
            rendezvous = new RendezvousSocket(`ws://${juttleServiceHost}/rendezvous/${runMode.rendezvous}`);
            rendezvous.on('message', msg => store.dispatch(promulgateBundle(msg.bundle, msg.bundle_id)));
        }
    }

    observeStore(store, runModeSelector, runModeChanged);
}

export default function (store) {
    runMode(store);
}
