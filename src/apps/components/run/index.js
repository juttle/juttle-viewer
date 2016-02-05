import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import * as actions from '../../actions';

import Juttle from 'juttle-client-library';
import JuttleViewer from './juttle-viewer';


class RunApp extends React.Component {
    componentDidMount() {
        // construct client plus views and inputs
        let client = new Juttle(this.props.juttleServiceHost);
        this.view = new client.View(this.refs.juttleViewLayout);
        this.inputs = new client.Input(this.refs.juttleInputGroups);
        this.errors = new client.Errors(this.refs.errorView);
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.bundle !== this.props.bundle) {
            this.errors.clear();
            this.inputs.clear();

            this.view.clear()
            .then(() => {
                if (nextProps.bundle) {
                    this.inputs.render(nextProps.bundle);
                    // if no inputs run view automagically
                    if (nextProps.inputs.length === 0) {
                        setTimeout(() => { self.runView() });
                    }
                }
            })
        }

        if (nextProps.error && !_.isEqual(nextProps.error, this.props.error)) {
            this.errors.render(nextProps.error);
        }
    }

    runView = () => {
        let { dispatch } = this.props;

        this.view.run(this.props.bundle, this.inputs.getValues())
        .then(jobEvents => {
            jobEvents.on('error', (err) => { dispatch(actions.newError(err)) });
            jobEvents.on('warning', (warning) => { dispatch(actions.newError(warning)) });
        });
    };

    handleRunClick = () => {
        this.runView();
    };

    render() {
        return (
            <div className="app-main">
                <div className="main-view">
                    <JuttleViewer bundle={this.props.bundle} />
                    <div ref="juttleSource"></div>
                    <div ref="juttleViewLayout"></div>
                    <div ref="errorView"></div>
                </div>
                <div className="right-rail">
                    <div ref="juttleInputGroups"></div>
                    <button
                        onClick={this.handleRunClick}
                        disabled={!this.props.bundle}
                        className="btn btn-primary">
                        Run
                    </button>
                </div>
            </div>
        );
    }
}

function select(state) {
    return {
        error: state.bundleInfo.error,
        bundle: state.bundleInfo.bundle,
        inputs: state.bundleInfo.inputs,
        juttleServiceHost: state.juttleServiceHost
    };
}

export default connect(select)(RunApp);
