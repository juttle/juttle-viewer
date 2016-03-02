import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';

import RunHeader from '../../../src/apps/components/run-header';

chai.use(sinonChai);

const { expect } = chai;

describe('run-header', () => {
    it('fires run click on ENTER_KEY from inputs', () => {
        const props = {
            runMode: { path: 'test', rendezvous: null }
        }
        let clickStub = sinon.stub();

        let runHeaderElement = ReactTestUtils.renderIntoDocument(<RunHeader {...props} onRunClick={clickStub}/>);

        ReactTestUtils.Simulate.keyDown(runHeaderElement.refs.juttleInputsContainer, {
            key: 'Enter',
            keyCode: 13,
            which: 13
        });

        expect(clickStub).to.have.been.called;
    });
});
