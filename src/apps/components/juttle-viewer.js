import React from 'react';

import JuttleEditor from './juttle-editor';
import { newBundle } from '../actions';
import { LOCAL_BUNDLE_ID } from '../constants';
import { Link } from 'react-router';

class JuttleViewer extends React.Component {
    constructor(props) {
        super(props);
        let isNewBundle = !props.bundle;
        if (isNewBundle) {
            props.dispatch(newBundle(LOCAL_BUNDLE_ID, {program: ''}, {}));
        }
    }

    handleClick = () => {
        if (this.props.bundle) {
            localStorage.setItem('program', this.props.bundle.program);
        }
    }

    render() {
        var readOnly = !this.props.runMode.local;
        let editButton = readOnly ? (
        <Link to={{ pathname: '/', query: { local: true }}} onClick={this.handleClick} className="btn btn-default btn-edit" >edit</Link>
        ): null;

        return (
            <div className="juttle-editor">
                {editButton}
                <div className='juttle-source'>
                    <JuttleEditor
                        {...this.props}
                        readOnly={readOnly}
                    />
                </div>
            </div>
        );
    }
}

export default JuttleViewer;
