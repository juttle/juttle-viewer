import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk' // allows for async actions

import ViewLayout from './containers/view-layout';
import InputGroup from './containers/input-group';
import reducers from './reducers';
import jobMiddleware from './middleware/job-socket';
import * as api from './utils/api';

import {
    updateProgram,
    updateModules,
    runBundle,
    updateInputDefs
} from './actions';

import './sass/main.scss'

export default class Juttle {
    constructor(opts) {
        if (!opts.serverUrl) {
            throw new Error('must provider server_url param');
        }

        this.serverUrl = opts.serverUrl;
        this.viewsEl = opts.viewsEl;
        this.inputsEl = opts.inputsEl;

        const store = compose(
            applyMiddleware(thunk, jobMiddleware)
        )(createStore)(reducers);

        this.store = store;

        render(
            <Provider store={this.store}>
                <ViewLayout />
            </Provider>,
            this.viewsEl
        );

        render(
            <Provider store={this.store}>
                <InputGroup />
            </Provider>,
            this.inputsEl
        );
    }

    _updateBundle(bundle) {
        let { dispatch } = this.store;

        // XXX:mnibecker updateProgram & updateModules should be
        // a single dispatch event
        dispatch(updateProgram(bundle.program));
        dispatch(updateModules(bundle.modules));
    }

    /*
     * Runs a bundle and displays output
     */
    run(bundle) {
        let { dispatch } = this.store;
        this._updateBundle(bundle);

        dispatch(runBundle());
    }

    /*
     * Will render inputs for a given bundle
     */
    prepare(bundle) {
        let { dispatch } = this.store;
        this._updateBundle(bundle);

        return api.getInputs(bundle)
        .then(inputs => {
            dispatch(updateInputDefs(inputs));
        });
    }

    /*
     * Fetches inputs for the current bundle
     * Required the prepare is run first
     */
    getInputs() {
        return this.store.getState().inputs;
    }
}
