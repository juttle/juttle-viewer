'use strict';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../src/apps/actions';

const fakeHost = 'localhost:8080';
const API_PREFIX = '/api/v0';
const mockStore = configureMockStore([ thunk ]);

describe('redux actions', () => {
    describe('refetchPathBundle action', (done) => {

        afterEach(() => {
            nock.cleanAll();
        });

        it('refetches bundle in path mode', () => {
            const testBundle = {
                program: 'emit',
                modules: {}
            };

            const expectedActions = [{
                type: actions.UPDATE_BUNDLE,
                bundle: testBundle
            }];

            const store = mockStore({
                juttleServiceHost: fakeHost,
                runMode: {
                    path: '/test.juttle',
                    rendezvous: null
                }
            }, expectedActions, done);

            nock(`http://${fakeHost}${API_PREFIX}`)
                .get('/paths/test.juttle')
                .reply(200, { bundle: testBundle });

            store.dispatch(actions.refetchPathBundle());
        });

        it('does nothing in rendezvous mode', () => {
            const store = mockStore({
                juttleServiceHost: fakeHost,
                runMode: {
                    path: null,
                    rendezvous: 'test'
                }
            }, [], done);
            store.dispatch(actions.refetchPathBundle());
        });

        it('dispatches error with invalid bundle', () => {
            const testError = {
                err: 'there was an error'
            };

            const expectedActions = [{
                type: actions.NEW_ERROR,
                bundle: testError
            }]

            const store = mockStore({
                juttleServiceHost: fakeHost,
                runMode: {
                    path: '/test.juttle',
                    rendezvous: null
                }
            }, expectedActions, done);

            nock(`http://${fakeHost}${API_PREFIX}`)
                .get('/paths/test.juttle')
                .reply(400, testError);

            store.dispatch(actions.refetchPathBundle());
        });
    });

});
