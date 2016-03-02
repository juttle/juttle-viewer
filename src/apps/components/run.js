import Promise from 'bluebird';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

import Juttle from 'juttle-client-library';
import JuttleViewer from './juttle-viewer';
import ErrorView from './error-view';

const ENTER_KEY = 13;

class RunApp extends React.Component {
    componentDidMount() {
        // construct client plus views and inputs
        let client = new Juttle(this.props.juttleServiceHost);
        this.view = new client.View(this.refs.juttleViewLayout);
        this.inputs = new client.Input(this.refs.juttleInputsContainer);

        // subscribe to runtime errors
        this.view.on('error', this.runtimeError.bind(this, 'error'));
        this.view.on('warning', this.runtimeError.bind(this, 'warning'));
    }

    _onInputContainerKeyDown = (e) => {
        if (e.keyCode === ENTER_KEY) {
            this.runView();
        }
    };

    componentWillReceiveProps(nextProps) {
        let self = this;
        let newBundle = nextProps.bundleId !== this.props.bundleId;
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

                // if not newBundle or  no inputs run view automagically
                if (!newBundle || nextProps.inputs.length === 0) {
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
                <div className="main-view">
                    <JuttleViewer bundle={this.props.bundle} />
                    <div ref="juttleSource"></div>
                    <div ref="juttleViewLayout"></div>
                    <ErrorView error={this.props.error} />
                </div>
                <div className="right-rail">
                    <div ref="juttleInputsContainer" onKeyDown={this._onInputContainerKeyDown}></div>
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
        bundleId: state.bundleInfo.bundleId,
        bundle: state.bundleInfo.bundle,
        inputs: state.bundleInfo.inputs,
        juttleServiceHost: state.juttleServiceHost
    };
}

export default connect(select)(RunApp);
