import Promise from 'bluebird';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

import { Views, Inputs } from 'juttle-client-library';
import ErrorView from './error-view';
import RunHeader from './run-header';

// export here to allow for unit test on component itself
export class RunApp extends React.Component {
    componentDidMount() {
        // construct client plus views and inputs
        this.view = new Views(this.props.juttleServiceHost, this.refs.juttleViewLayout);
        this.inputs = new Inputs(this.props.juttleServiceHost, this.refs.runHeader.getInputsEl());

        // subscribe to runtime errors
        this.view.on('error', this.runtimeError.bind(this, 'error'));
        this.view.on('warning', this.runtimeError.bind(this, 'warning'));
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        let newBundle = nextProps.bundleId !== this.props.bundleId;
        let isLocal = nextProps.bundleId === 'local';
        let bundleUpdated = newBundle || (nextProps.bundle !== this.props.bundle);

        // if no bundle clear everything
        if (!nextProps.bundle) {
            this.inputs.clear();
            this.view.clear();
            return ;
        }

        if (newBundle) {
            this.inputs.clear();
            this.inputs.render(nextProps.bundle);
        }

        if (bundleUpdated) {
            Promise.all([
                this.view.clear(),
                this.inputs.getValues()
            ])
            .then(res => {
                let inputValues = res[1];

                if ((!newBundle || nextProps.inputs.length === 0) && !isLocal) {
                    return this.view.run(nextProps.bundle, inputValues);
                }
            })
            .catch(err => self.props.dispatch(actions.newError(err)));
        }
    }

    runtimeError = (type, err) => {
        this.props.dispatch(actions.newError(err));
    };

    runView = () => {
        let { dispatch } = this.props;

        this.inputs.getValues()
        .then((values) => {
            return this.view.run(this.props.bundle, values);
        })
        .catch(err => { dispatch(actions.newError(err)) });
    };

    handleRunClick = () => {
        this.runView();
    };

    render() {
        return (
            <div className="app-main">
                <RunHeader {...this.props} onRunClick={this.handleRunClick} ref="runHeader" />
                <div className="run-main">
                    <div ref="juttleSource"></div>
                    <div ref="juttleViewLayout"></div>
                    <ErrorView error={this.props.error} />
                </div>
            </div>
        );
    }
}

function select(state) {
    return {
        runMode: state.runMode,
        error: state.bundleInfo.error,
        bundleId: state.bundleInfo.bundleId,
        bundle: state.bundleInfo.bundle,
        inputs: state.bundleInfo.inputs,
        juttleServiceHost: state.juttleServiceHost
    };
}

export default connect(select)(RunApp);
