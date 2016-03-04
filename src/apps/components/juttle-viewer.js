import React from 'react';

import JuttleEditor from './juttle-editor';
import { newBundle } from '../actions';
import { LOCAL_BUNDLE_ID } from '../constants';

class JuttleViewer extends React.Component {
    constructor(props) {
        super(props);
        let isNewBundle = !props.bundle;
        if (isNewBundle) {
            props.dispatch(newBundle(LOCAL_BUNDLE_ID, {program: ''}, {}));
        }

        let query = window.location.search || '';
        let isLocal = query.match(/\?local/);
        this.state = {
            readOnly: !isNewBundle && !isLocal
        };
    }

    edit() {
        window.history.pushState('local', 'local', '?local');

        if (this.props.bundle) {
            localStorage.setItem('program', this.props.bundle.program);
        }

        this.setState({
            readOnly: false
        });
    }

    render() {
        let editButton = this.state.readOnly ? <button
            onClick={this.edit.bind(this)}
            className="btn btn-default btn-code btn-edit">
            edit
        </button> : null;
        return (
            <div className="juttle-editor">
                {editButton}
                <div className='juttle-source'>
                    <JuttleEditor
                        {...this.props}
                        readOnly={this.state.readOnly}
                    />
                </div>
            </div>
        );
    }
}

export default JuttleViewer;
