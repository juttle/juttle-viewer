import React from 'react';

import AceEditor from 'juttle-react-ace';

import { promulgateBundle } from '../actions';
import { LOCAL_BUNDLE_ID } from '../constants';

import 'brace/theme/monokai';
import './juttle-mode/mode';

const FONT_SIZE = 14;
const EDIT_EVAL_INTERVAL_MS = 500;
const SCROLL_MARGIN_TOP = 15;
const SCROLL_MARGIN_BOTTOM = 15;

class JuttleEditor extends React.Component {
    onChange = (newValue) => {
        if (!this.props.readOnly) {
            this._updateProgram(newValue);
            localStorage.setItem('program', newValue);
        }
    }

    _updateProgram(newValue) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            let bundle = {program: newValue};
            this.props.dispatch(promulgateBundle(bundle, LOCAL_BUNDLE_ID));
        }, EDIT_EVAL_INTERVAL_MS);
    }

    componentDidMount() {
        let { editor } = this.refs.aceEditor;
        editor.renderer.setScrollMargin(SCROLL_MARGIN_TOP, SCROLL_MARGIN_BOTTOM);
        editor.setOptions({
            maxLines: Infinity
        });
    }

    onRunClick = () => {
        clearTimeout(this.timeout);
        let bundle = {program: this.refs.aceEditor.editor.getValue()};
        this.props.dispatch(promulgateBundle(bundle, LOCAL_BUNDLE_ID)).then(() => {
            this.props.onRunClick();
        });
    }

    render() {
        let program = this.props.bundle ? this.props.bundle.program : '';
        let RUN_JUTTLE = {
            name: 'RUN_JUTTLE',
            bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
            exec: this.onRunClick
        };
        let commands = [RUN_JUTTLE];

        return (
            <AceEditor
              ref="aceEditor"
              theme="monokai"
              width="100%"
              mode="juttle"
              onChange={this.onChange}
              value={program}
              commands={commands}
              fontSize={FONT_SIZE}
              readOnly={this.props.readOnly}
              showPrintMargin={false}
            />
        );
    }
}

export default JuttleEditor;
