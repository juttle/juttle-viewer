import url from "fast-url-parser";

import Juttle from "../../client-lib";
import { getBundle } from "../../client-lib/utils/api";

import '../sass/main.scss'

let currentBundle;

let currentJuttle = new Juttle({
    serverUrl: 'http://localhost:2000',
    viewsEl: document.getElementById('juttle-view-layout'),
    inputsEl: document.getElementById('juttle-input-groups')
});

let parsed = url.parse(window.location.href, true);

getBundle(parsed.query.path)
.then((res) => {
    currentBundle = res.bundle
    return currentJuttle.prepare(currentBundle);
})
.then(() => {
    if (currentJuttle.getInputs().length === 0) {
        return currentJuttle.run(currentBundle);
    }
});

document.getElementsByClassName('btn-run')[0].addEventListener('click', e => {
    currentJuttle.run(currentBundle);
});
