import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

import JuttleEditor from '../../../src/apps/components/juttle-editor';

describe('juttle editor', () => {
    it('puts an editor on the DOM and takes it off', () => {
        let el = ReactTestUtils.renderIntoDocument((
            <JuttleEditor />
        ));

        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(el).parentNode);
    });
});
