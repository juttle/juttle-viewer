import { expect } from 'chai';

import reducers from '../../src/apps/reducers';
import * as actions from '../../src/apps/actions';

describe('reducers', () => {
    describe('bundleInfo reducer', () => {
        const fakeBundle1 = { program: 'emit -limit 1', modules: [] };
        const fakeBundle2 = { program: 'emit -limit 1000', modules: [] };

        it('should return initial state', () => {
            expect(
                reducers(undefined, {}).bundleInfo
            ).to.deep.equal({
                bundleId: null,
                bundle: null,
                inputs: null,
                error: null
            });
        });

        it('reset error with NEW_BUNDLE event', () => {
            const startBundleInfo = {
                bundleId: 'test',
                bundle: fakeBundle1,
                inputs: {},
                error: 'i am angry'
            }

            const endBundleInfo = {
                bundleId: 'test2',
                bundle: fakeBundle2,
                inputs: {},
                error: null
            }

            expect(
                reducers(
                    { bundleInfo: startBundleInfo},
                    actions.newBundle(endBundleInfo.bundleId, endBundleInfo.bundle, endBundleInfo.inputs)
                ).bundleInfo
            ).to.deep.equal(endBundleInfo);
        });

        it('fetch bundle error stores bundleId', () => {
            const startBundleInfo = {
                bundleId: 'test',
                bundle: fakeBundle1,
                inputs: {},
                error: null
            };

            const endBundleInfo = {
                bundleId: 'test',
                bundle: fakeBundle1,
                inputs: {},
                error: {
                    code: 'TEST-ERROR',
                    message: 'there was an error',
                    info: {}
                }
            };

            expect(
                reducers(
                    { bundleInfo: startBundleInfo },
                    actions.fetchBundleError('test', endBundleInfo.error, fakeBundle1)
                ).bundleInfo
            ).to.deep.equal(endBundleInfo);
        });
    });
});
