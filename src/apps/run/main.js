import url from 'fast-url-parser';

import Juttle from 'juttle-client-library';
import { getBundle } from '../../client-lib/utils/api';
import RendezvousSocket from '../../client-lib/utils/rendezvous-socket';

import 'juttle-client-library/dist/juttle-client-library.css';
import '../sass/main.scss';

// construct client plus views and inputs
let outriggerHost = window.location.host;
let client = new Juttle(outriggerHost);
let view = new client.View(document.getElementById("juttle-view-layout"));
let inputs = new client.Input(document.getElementById("juttle-input-groups"));

let currentBundle;
let parsed = url.parse(window.location.href, true);

let initBundle = (bundle) => {
    currentBundle = bundle;
    client.describe(bundle)
    .then((desc) => {
        // if we have no inputs go ahead and run
        if (desc.inputs.length === 0) {
            view.run(bundle);
        } else {
            inputs.render(bundle);
        }
    });
};

if (parsed.query.path) {
    client.describe(parsed.query.path)
    .then(bundle => initBundle(bundle));
} else if (parsed.query.rendezvous) {
    let rendezvousUrl = `ws://${outriggerHost}/rendezvous/${parsed.query.rendezvous}`
    let rendezvous = new RendezvousSocket(rendezvousUrl);

    rendezvous.on('message', msg => initBundle(msg.bundle));
}

// run btn click
document.getElementById("btn-run").addEventListener("click", () => {
    view.run(currentBundle, inputs.getValues());
});
