import { expect } from 'chai';

import reducers from '../../src/apps/reducers';
import * as actions from '../../src/apps/actions';

describe('reducers', () => {
    describe('bundleInfo', () => {
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
                inputs: [],
                error: 'i am angry'
            }

            const endBundleInfo = {
                bundleId: 'test2',
                bundle: fakeBundle2,
                inputs: [],
                error: null
            }

            expect(
                reducers(
                    { bundleInfo: startBundleInfo},
                    actions.newBundle(endBundleInfo.bundleId, endBundleInfo.bundle, endBundleInfo.inputs)
                ).bundleInfo
            ).to.deep.equal(endBundleInfo);
        });

        it('reset error with UPDATE_BUNDLE event', () => {
            const startBundleInfo = {
                bundleId: 'test',
                bundle: fakeBundle1,
                inputs: [],
                error: 'i am angry'
            };

            expect(
                reducers(
                    { bundleInfo: startBundleInfo },
                    { type: actions.UPDATE_BUNDLE, bundle: fakeBundle2, inputs: [] }
                ).bundleInfo
            ).to.deep.equal(Object.assign({}, startBundleInfo, {
                bundle: fakeBundle2,
                error: null
            }));
        });

        it('updates inputs in UPDATE_BUNDLE event', () => {
            const startBundleInfo = {
                bundleId: 'test',
                bundle: fakeBundle1,
                inputs: [],
                error: null
            };

            const fakeInputs = [{
                id: 'test_input',
                options: {},
                static: true,
                type: 'text'
            }];

            expect(
                reducers(
                    { bundleInfo: startBundleInfo },
                    { type: actions.UPDATE_BUNDLE, bundle: fakeBundle2, inputs: fakeInputs }
                ).bundleInfo
            ).to.deep.equal(Object.assign({}, startBundleInfo, {
                bundle: fakeBundle2,
                inputs: fakeInputs
            }));
        });
    });
});
