import url from "fast-url-parser";

import Juttle from "juttle-client-library";
import { getBundle } from "../../client-lib/utils/api";

import 'juttle-client-library/dist/juttle-client-library.css';
import '../sass/main.scss';

// construct client plus views and inputs
let outriggerHost = window.location.host;
let client = new Juttle(outriggerHost);
let view = new client.View(document.getElementById("juttle-view-layout"));
let inputs = new client.Input(document.getElementById("juttle-input-groups"));

let currentBundle;
let parsed = url.parse(window.location.href, true);

getBundle(parsed.query.path)
.then((res) => {
    currentBundle = res.bundle;
    return client.describe(currentBundle);
})
.then((desc) => {
    // if we have no inputs go ahead and run
    if (desc.inputs.length === 0) {
        view.run(currentBundle);
    } else {
        inputs.render(currentBundle);
    }
})

// run btn click
document.getElementById("btn-run").addEventListener("click", () => {
    view.run(currentBundle, inputs.getValues());
});
