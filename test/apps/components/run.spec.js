import Promise from 'bluebird';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';
import * as jcl from 'juttle-client-library';

import { RunApp } from '../../../src/apps/components/run';

chai.use(sinonChai);

const { expect } = chai;

class Parent extends React.Component {
    constructor(initialState) {
        super();
        this.state = initialState;
    }

    render() {
        return <RunApp {...this.state} />
    }
}

let TestParent = React.createFactory(Parent);

describe('run app', () => {
    describe('jcl calls', () => {

        let sandbox;
        const defaultProps = {
            runMode: {},
            error: null,
            bundleId: null,
            bundle: null,
            inputs: null,
            juttleServiceHost: 'localhost:8080'
        };

        function generateStubs(inputGetValues) {

            let viewClearPromise = Promise.resolve();
            let inputGetValuesPromise = Promise.resolve(inputGetValues);
            let viewRunPromise = Promise.resolve();

            return {
                inputClear: sandbox.stub(jcl.Inputs.prototype, 'clear'),
                inputRender: sandbox.stub(jcl.Inputs.prototype, 'render'),
                inputGetValues: sandbox.stub(jcl.Inputs.prototype, 'getValues')
                    .returns(inputGetValuesPromise),
                viewClear: sandbox.stub(jcl.Views.prototype, 'clear')
                    .returns(viewClearPromise),
                viewRun: sandbox.stub(jcl.Views.prototype, 'run')
                    .returns(viewRunPromise),
                viewClearPromise,
                inputGetValuesPromise,
                viewRunPromise
            };
        }

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('jcl constructors called correctly', () => {

            let ViewConstructor = sandbox.stub(jcl, 'Views');
            let InputConstructor = sandbox.stub(jcl, 'Inputs');

            // overriding constructor wipes all functions, create stub for on subscriptions
            let viewOnStub = sandbox.stub();
            let viewGetStatusStub = sandbox.stub().returns(jcl.ViewStatus.STOPPED);
            ViewConstructor.prototype.on = viewOnStub;
            ViewConstructor.prototype.getStatus = viewGetStatusStub;

            let el = TestUtils.renderIntoDocument(<RunApp {...defaultProps} />);

            expect(ViewConstructor).to.have.been.calledWithNew;
            expect(ViewConstructor).to.have.been.calledWith(defaultProps.juttleServiceHost);
            expect(InputConstructor).to.have.been.calledWithNew;
            expect(InputConstructor).to.have.been.calledWith(defaultProps.juttleServiceHost);

            expect(viewOnStub).to.have.been.calledThrice;
            expect(viewOnStub.args[0][0]).to.equal('error');
            expect(viewOnStub.args[1][0]).to.equal('warning');
            expect(viewOnStub.args[2][0]).to.equal('view-status');
            expect(viewGetStatusStub).to.have.been.called;

            expect(el.state).to.deep.equal({ runState: jcl.ViewStatus.STOPPED });
        });

        it('bundle with no inputs calls Views render', () => {
            let props = Object.assign({}, defaultProps, {
                bundleId: 'test',
                bundle: { program: 'emit', modules: {} },
                inputs: []
            });
            const getValues = [1];
            const st = generateStubs(getValues);

            let runElement = TestUtils.renderIntoDocument(TestParent(defaultProps));
            runElement.setState(props);

            expect(st.inputClear).to.have.been.calledOnce;
            expect(st.inputRender).to.have.been.calledWith(props.bundle);
            expect(st.inputGetValues).to.have.been.calledOnce;
            expect(st.viewClear).to.have.been.calledOnce;

            return Promise.all([st.getValuesPromise, st.viewClearPromise])
            .then(() => {
                expect(st.viewRun).to.have.been.calledOnce;
                expect(st.viewRun.args).to.deep.equal([[
                    props.bundle,
                    getValues
                ]]);
            });
        });

        it('bundle with inputs does not call Views render', () => {
            let props = Object.assign({}, defaultProps, {
                bundleId: 'test',
                bundle: { program: 'emit', modules: {} },
                inputs: [{
                    type: 'text',
                    id: 'test',
                    static: true,
                    value: null
                }]
            });
            const getValues = [];
            const st = generateStubs(getValues);

            let runElement = TestUtils.renderIntoDocument(TestParent(defaultProps));
            runElement.setState(props);

            expect(st.inputClear).to.have.been.calledOnce;
            expect(st.inputRender).to.have.been.calledWith(props.bundle);
            expect(st.inputGetValues).to.have.been.calledOnce;
            expect(st.viewClear).to.have.been.calledOnce;

            return Promise.all([st.viewClearPromise, st.getValuesPromise])
            .then(() => {
                expect(st.viewRun).to.have.been.notCalled;
            });
        });

        it('updated bundle with inputs calls view.run when NOT new', () => {
            const initProps = Object.assign({}, defaultProps, {
                bundleId: 'test',
                bundle: { program: 'emit', modules: {} },
                inputs: [{
                    type: 'text',
                    id: 'test',
                    static: true,
                    value: null
                }]
            });
            const finalProps = Object.assign({}, initProps, {
                bundle: { program: 'emit -limit 1', modules: {} }
            });

            const getValues = [];
            const st = generateStubs(getValues);

            let runElement = TestUtils.renderIntoDocument(TestParent(initProps));
            runElement.setState(finalProps);

            expect(st.inputClear).to.have.been.notCalled;
            expect(st.inputRender).to.have.been.notCalled;
            expect(st.inputGetValues).to.have.been.calledOnce;
            expect(st.viewClear).to.have.been.calledOnce;

            return Promise.all([st.viewClearPromise, st.getValuesPromise])
            .then(() => {
                expect(st.viewRun).to.have.been.calledOnce;
                expect(st.viewRun.args).to.deep.equal([[
                    finalProps.bundle,
                    getValues
                ]]);
            });
        });

        it('null bundle causes only inputs clear and view clear to be called', () => {
            const st = generateStubs();

            let runElement = TestUtils.renderIntoDocument(TestParent(defaultProps));
            runElement.setState(defaultProps);

            expect(st.inputClear).to.have.been.calledOnce;
            expect(st.viewClear).to.have.been.calledOnce;
            expect(st.inputRender).to.have.been.notCalled;
            expect(st.inputGetValues).to.have.been.notCalled;
        });
    })
});
