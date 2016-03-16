import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import JuttleEditor from '../../../src/apps/components/juttle-editor';
import JuttleViewer from '../../../src/apps/components/juttle-viewer';

describe('juttle editor', () => {
    it('puts an editor on the DOM and takes it off', () => {
        let el = ReactTestUtils.renderIntoDocument((
            <JuttleEditor />
        ));

        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(el).parentNode);
    });

    it('shows an edit button when readOnly', function() {
        let runMode = {local: false};
        let el = ReactTestUtils.renderIntoDocument((
            <JuttleViewer runMode={runMode}/>
        ));

        expect(el.refs.editButton).exist;

        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(el).parentNode);
    });

    it('shows no edit button when in local mode', function() {
        let runMode = {local: true};
        let el = ReactTestUtils.renderIntoDocument((
            <JuttleViewer runMode={runMode}/>
        ));

        expect(el.refs.editButton).not.exist;

        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(el).parentNode);
    });
});
