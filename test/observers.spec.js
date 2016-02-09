'use strict';
import observers from '../src/apps/observers';
import findFreePort from 'find-free-port';
import nock from 'nock';
import { Server as mockSocketServer, WebSocket } from 'mock-socket';
import EventEmitter from 'eventemitter3';
import { expect } from 'chai';
import { NEW_BUNDLE } from '../src/apps/actions';

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

    getState() {
        return this.state;
    }

    updateState(newState) {
        newState = Object.assign(this.state, newState);
        this.subscribeCB(this.state);
    }

    subscribe(cb) {
        this.subscribeCB = cb;
    }

    dispatch(action) {
        this.event.emit(action.type, action);
    }
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

    it('properly fetches bundle from null runMode', (done) => {
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

        store.event.once(NEW_BUNDLE, (action) => {
            expect(action).to.deep.equal({
                type: NEW_BUNDLE,
                bundle: fakeJuttle1,
                inputs: []
            });

            done();
        });

        store.updateState({
            runMode: {
                path: '/fake1.juttle',
                rendezvous: null
            }
        });

    });

    it('fetches bundle from path set runMode', (done) => {
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


        store.event.once(NEW_BUNDLE, (action) => {
            expect(action).to.deep.equal({
                type: NEW_BUNDLE,
                bundle: fakeJuttle2,
                inputs: []
            });

            done();
        });

        store.updateState({
            runMode: {
                path: '/fake2.juttle',
                rendezvous: null
            }
        });
    });

    it('receives bundle for rendezvous runMode', (done) => {
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

        store.event.once(NEW_BUNDLE, (action) => {
            expect(action).to.deep.equal({
                type: NEW_BUNDLE,
                bundle: rendezJuttle,
                inputs: []
            });

            done();
        });

        store.updateState({
            runMode: {
                path: null,
                rendezvous: 'test'
            }
        });

        mockServer.send(JSON.stringify({
            bundle: rendezJuttle
        }));
    });

});
