'use strict';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../src/apps/actions';

const fakeHost = 'localhost:8080';
const API_PREFIX = '/api/v0';
const mockStore = configureMockStore([ thunk ]);

describe('redux actions', () => {
    describe('refetchPathBundle action', () => {

        afterEach(() => {
            nock.cleanAll();
        });

        it('refetches bundle in path mode', (done) => {
            const testBundle = {
                program: 'emit',
                modules: {}
            };

            const testInputs = [{
                id: 'test_input',
                options: {},
                static: true,
                type: 'text'
            }];

            const expectedActions = [{
                type: actions.UPDATE_BUNDLE,
                bundle: testBundle,
                inputs: testInputs
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
                .reply(200, { bundle: testBundle })
                .post('/prepare', {
                    bundle: testBundle,
                    inputs: {}
                })
                .reply(200, testInputs);

            store.dispatch(actions.refetchPathBundle());
        });

        it('dispatches error with invalid bundle', (done) => {
            const responseError = {
                message: 'there was an error',
                code: 'ERROR-WAS-HERE',
                info: {}
            };
            let actionError = new Error(responseError.message);
            actionError.code = responseError.code;
            actionError.info = responseError.info;

            const expectedActions = [{
                type: actions.NEW_ERROR,
                error: actionError
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
                .reply(400, responseError);

            store.dispatch(actions.refetchPathBundle());
        });
    });

});
