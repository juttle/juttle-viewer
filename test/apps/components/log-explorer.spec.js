import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import chai from 'chai';

import LogExplorer from '../../../src/apps/components/log-explorer/log-explorer';
import KEY_CODES from '../../../src/apps/components/log-explorer/key-codes';


const { expect } = chai;

const WINDOW_SIZE = 10;
const DEFAULT_WINDOW_START = 1;

let example_logs = [
    '[2016-03-15T17:05:02.786Z] [debug] config - loading, /Users/vlad/.juttle/config.js',
    '[2016-03-15T17:05:02.789Z] [debug] juttle-adapter - configuring adapters, postgres,mysql,opentsdb,sqlite',
    '[2016-03-15T17:05:02.789Z] [debug] juttle-adapter - configuring builtin adapters',
    '[2016-03-15T17:05:02.790Z] [info] juttle-subprocess - starting-juttle-program, input text: text',
    '[2016-03-15T17:05:03.141Z] [debug] juttle-adapter - postgres, adapter loaded in, 213, ms,, initialized in, 54, ms',
    '[2016-03-15T17:05:03.148Z] [debug] proc-read-postgres - initializing, options:, {"table":"logs","from":"2016-02-14T17:05:02.792Z","to":"2016-03-15T17:05:02.792Z"}',
    '[2016-03-15T17:05:03.149Z] [debug] proc-read-postgres - instantiating adapter:, postgres'
];

example_logs = [...example_logs, ...example_logs, ...example_logs];
example_logs = example_logs.map((logText, i) => { return { text: logText, index: i + 1 } });

function getPressKeyFunction(logExplorerElement) {
    return (name, expectedCursorPosition, windowStart) => {
        ReactTestUtils.Simulate.keyDown(logExplorerElement.refs.currentLogOutput, {
            keyCode: KEY_CODES[name]
        });
        expect(logExplorerElement.state.cursorPosition).to.equal(expectedCursorPosition, 'cursor position after ' + name);
        expect(logExplorerElement.state.windowStart).to.equal(windowStart || DEFAULT_WINDOW_START, 'window start after ' + name);
    }
}


describe('run-debugger', () => {
    it('page a scroll using less commands', () => {
        const props = {
            logLines: example_logs
        }
        
        let logExplorerElement = ReactTestUtils.renderIntoDocument(<LogExplorer {...props} />);
        let executeKey = getPressKeyFunction(logExplorerElement);
        
        ReactTestUtils.Simulate.click(logExplorerElement.refs.currentLogOutput);
        
        // up and down
        let startCursorPosition = logExplorerElement.state.cursorPosition;
        executeKey('downArrow', startCursorPosition + 1);
        executeKey('downArrow', startCursorPosition + 2);
        executeKey('upArrow', startCursorPosition + 1);
        executeKey('j', startCursorPosition + 2)
        executeKey('k', startCursorPosition + 1);
        
        //paging
        startCursorPosition = logExplorerElement.state.cursorPosition;
        executeKey('space', startCursorPosition + WINDOW_SIZE, 11);
        executeKey('b', startCursorPosition);
        executeKey('space', startCursorPosition + WINDOW_SIZE, 11);
        
        expect(logExplorerElement.state.cursorPosition).not.equal(1);
        executeKey('g', 1);
    });
    it('search interaction', () => {
        const searchTerm = 'postgres';
        const props = {
            logLines: example_logs
        }
        
        let logExplorerElement = ReactTestUtils.renderIntoDocument(<LogExplorer {...props} />);
        let executeKey = getPressKeyFunction(logExplorerElement);
        ReactTestUtils.Simulate.click(logExplorerElement.refs.currentLogOutput);
        executeKey('g', 1); //move to start
        ReactTestUtils.Simulate.keyDown(logExplorerElement.refs.currentLogOutput, {
            keyCode: KEY_CODES.forwardSlash
        });
        
        var node = logExplorerElement.refs.searchTermBox
        node.value = searchTerm;
        ReactTestUtils.Simulate.change(node);
        ReactTestUtils.Simulate.keyUp(node, {key: 'Enter', keyCode: 13, which: 13});
        
        expect(logExplorerElement.state.searchTerm).to.equal(searchTerm);
        expect(logExplorerElement.state.cursorPosition).to.equal(2);

        executeKey('n', 5);
        executeKey('p', 2);
    });
});
