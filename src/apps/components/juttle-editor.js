import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';
import { newBundle } from '../actions';

import 'brace/theme/monokai';

class JuttleEditor extends React.Component {
    onChange(newValue) {
        this.props.dispatch(newBundle('local', {program: newValue}, {}));
    }

    render() {
        return (
            <AceEditor
              theme="monokai"
              height="100"
              onChange={this.onChange.bind(this)}
              value={this.props.bundle.program}
            />
        );
    }
}

export default JuttleEditor;
