'use strict';
import Promise from 'bluebird';
import observers from '../../src/apps/observers';
import findFreePort from 'find-free-port';
import nock from 'nock';
import { Server as mockSocketServer, WebSocket } from 'mock-socket';
import EventEmitter from 'eventemitter3';
import { expect } from 'chai';
import { NEW_BUNDLE, NEW_ERROR } from '../../src/apps/actions';
import { LOCAL_BUNDLE_ID } from '../../src/apps/constants';

const API_PREFIX = '/api/v0';

// Fake store is only for testing store-observers
// only implements getState and subscribe functions of a store
// can only register one function with subscribe
// dispatch() doesn't trigger subscribe() callback
class FakeStore {
    constructor(fakeState) {
        this.state = fakeState || {};
        this.event = new EventEmitter();
    }

    getState = () => {
        return this.state;
    };

    updateState(newState) {
        newState = Object.assign(this.state, newState);
        this.subscribeCB(this.state);
    }

    subscribe(cb) {
        this.subscribeCB = cb;
    }

    dispatch = (action) => {
        if (typeof action === 'function') {
            return action(this.dispatch, this.getState);
        }
        this.event.emit(action.type, action);
    };
}

function createFakeStore(state) {
    let fakeStore = new FakeStore(state);
    observers(fakeStore);
    return fakeStore;
}

describe('bundleMiddleware', () => {
    let testPort;

    beforeEach((done) => {
        findFreePort(2000, (err, freePort) => {
            testPort = freePort;
            done();
        })
    });

    afterEach(() => {
        nock.cleanAll();
    })

    it('properly fetches bundle from null runMode', () => {
        const fakeJuttle1 = {
            program: 'emit -limit 101',
            modules: []
        };

        nock(`http://localhost:${testPort}`)
            .get(`${API_PREFIX}/paths/fake1.juttle`)
            .reply(200, { bundle: fakeJuttle1 })
            .post(`${API_PREFIX}/prepare`, {
                bundle: fakeJuttle1,
                inputs: {}
            })
            .reply(200, [])

        const store = createFakeStore({
            juttleServiceHost: `localhost:${testPort}`,
            runMode: { path: null, rendezvous: null }
        });

        return new Promise((resolve, reject) => {
            store.event.once(NEW_BUNDLE, (action) => {
                resolve(action);
            });

            store.updateState({
                runMode: {
                    path: '/fake1.juttle',
                    rendezvous: null
                }
            });
        })
        .then(action => {
            expect(action).to.deep.equal({
                type: NEW_BUNDLE,
                bundleId: '/fake1.juttle',
                bundle: fakeJuttle1,
                inputs: []
            });
        })


    });

    it('handles errors from call to paths', () => {
        nock(`http://localhost:${testPort}`)
            .get(`${API_PREFIX}/paths/juttle1.juttle`)
            .reply(400, { code: 'JS-JUTTLE-ERROR', info: {}, message: 'Error from juttle compiler or runtime' });

        const store = createFakeStore({
            juttleServiceHost: `localhost:${testPort}`,
            runMode: { path: null, rendezvous: null }
        });

        return new Promise((resolve, reject) => {
            store.event.once(NEW_ERROR, (action) => {
                expect(action.error.code).to.equal('JS-JUTTLE-ERROR');
                resolve(action);
            });

            store.updateState({
                runMode: {
                    path: '/juttle1.juttle',
                    rendezvous: null
                }
            });
        });
    });

    it('fetches bundle from path set runMode', () => {
        const fakeJuttle2 = {
            program: 'emit -limit 102',
            modules: []
        };

        nock(`http://localhost:${testPort}`)
            .get(`${API_PREFIX}/paths/fake2.juttle`)
            .reply(200, { bundle: fakeJuttle2 })
            .post(`${API_PREFIX}/prepare`, {
                bundle: fakeJuttle2,
                inputs: {}
            })
            .reply(200, []);


        const store = createFakeStore({
            juttleServiceHost: `localhost:${testPort}`,
            runMode: {
                path: '/initial.juttle',
                rendezvous: null
            }
        });

        return new Promise(resolve => {
            store.event.once(NEW_BUNDLE, (action) => {
                resolve(action);
            });

            store.updateState({
                runMode: {
                    path: '/fake2.juttle',
                    rendezvous: null
                }
            });
        })
        .then(action => {
            expect(action).to.deep.equal({
                type: NEW_BUNDLE,
                bundleId: '/fake2.juttle',
                bundle: fakeJuttle2,
                inputs: []
            });
        });
    });

    it('receives bundle for rendezvous runMode', () => {
        const rendezJuttle = {
            program: 'emit -limit 9000',
            modules: []
        };

        // so the rendezvous socket can be called.
        global.WebSocket = WebSocket;

        nock(`http://localhost:${testPort}`)
            .get(`${API_PREFIX}/paths/redenz.juttle`)
            .reply(200)
            .post(`${API_PREFIX}/prepare`)
            .reply(200, []);

        const mockServer = new mockSocketServer(`ws://localhost:${testPort}/rendezvous/test`);
        const store = createFakeStore({
            juttleServiceHost: `localhost:${testPort}`,
            runMode: {
                path: 'path.juttle',
                rendezvous: null
            }
        });

        return new Promise(resolve => {
            store.event.once(NEW_BUNDLE, (action) => {
                resolve(action);
            });

            store.updateState({
                runMode: {
                    path: null,
                    rendezvous: 'test'
                }
            });

            mockServer.send(JSON.stringify({
                bundle_id: 'test.juttle',
                bundle: rendezJuttle
            }));
        })
        .then(action => {
            expect(action).to.deep.equal({
                type: NEW_BUNDLE,
                bundleId: 'test.juttle',
                bundle: rendezJuttle,
                inputs: []
            });
        });
    });

    it('promulgates a bundle when runMode becomes local', function() {
        const program = 'hello';
        const bundle = {program};
        nock(`http://localhost:${testPort}`)
            .post(`${API_PREFIX}/prepare`, {
                bundle,
                inputs: {}
            })
            .reply(200, []);

        const store = createFakeStore({
            juttleServiceHost: `localhost:${testPort}`,
            runMode: {
                path: null,
                rendezvous: null
            }
        });

        return new Promise(resolve => {
            store.event.once(NEW_BUNDLE, (action) => {
                resolve(action);
            });

            let localStorage = global.localStorage;
            localStorage.setItem('program', 'hello');

            store.updateState({
                runMode: {
                    path: null,
                    rendezvous: null,
                    local: true
                }
            });
        })
        .then(action => {
            expect(action).to.deep.equal({
                bundleId: LOCAL_BUNDLE_ID,
                bundle,
                type: NEW_BUNDLE,
                inputs: []
            });
        });
    });
});
