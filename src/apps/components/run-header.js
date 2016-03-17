import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { ViewStatus } from 'juttle-client-library';

import DirectoryListing from '../../client-lib/directory-listing';
import Dropdown from '../../client-lib/dropdown';
import JuttleViewer from './juttle-viewer';
import RunButton from './run-button';
import RunHeaderFullscreen from './run-header-fullscreen';
import LogExplorer from './log-explorer/log-explorer'

const ENTER_KEY = 13;

class RunHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            showJuttle: false,
            fullscreen: false,
            fullscreenMenu: false,
            showDebug: false
        };
    }

    // called by parent
    getInputsEl() {
        return this.refs.juttleInputsContainer;
    }

    _onInputContainerKeyDown = (e) => {
        if (e.keyCode === ENTER_KEY) {
            this.props.onRunClick();
        }
    };

    _toggleShowJuttle = () => {
        this.setState({
            showJuttle: !this.state.showJuttle
        });
    };

    _handleJuttleSelected = () => {
        this.refs.Dropdown.close();
    };

    _renderToggles() {
        let showJuttleClasses = classnames('btn', 'btn-default', 'btn-code', {
            'active': this.state.showJuttle
        });
        let showDebugClasses = classnames('btn', 'btn-default', 'btn-code', {
            'active': this.state.showDebug
        });

        let query = !this.props.bundle ? { local: true } : this.props.location.query;

        return (
            <div className="btn-group run-menu-toggles">
                <Link
                    onClick={this._toggleShowJuttle}
                    to={{ pathname: '/', query: query}}
                    className={showJuttleClasses}>
                    <i className="fa fa-lg fa-fw fa-code"></i>
                    <div className="font-btn-name">code</div>
                </Link>
                <button
                    onClick={this._toggleShowDebug}
                    ref="btnShowDebug"
                    className={showDebugClasses}>
                    <i className="fa fa-lg fa-fw fa-medkit"></i>
                    <div className="font-btn-name">debug</div>
                </button>
            </div>
        );
    }

    _toggleFullscreen = () => {
        this.setState({
            fullscreen: !this.state.fullscreen
        });
    };

    _toggleShowDebug = () => {
        this.setState({
            showDebug: !this.state.showDebug
        });
    };

    _run = () => {
        var options = {
            debug: this.state.showDebug
        };

        this.props.handleRun(options);
    }

    render() {
        let menuStyle = {
            'display': this.state.fullscreen ? 'none' : ''
        };
        let inputsStyle = {
            'display': this.props.bundle && this.props.inputs.length > 0 ? '' : 'none'
        };
        let programOptionsStyle = {
            'display': this.state.fullscreen ? 'none' : ''
        };

        let debugStyle = {
            'display': this.state.showDebug ? 'block' : 'none'
        };

        let juttleViewer = this.state.showJuttle ? <JuttleViewer {...this.props} onRunClick={this._run} /> : false;

        let runButtonText = this.props.runState === ViewStatus.STOPPED ? 'run' : 'stop';

        let runHeaderFullscreen = !this.state.fullscreen ? false : (
            <RunHeaderFullscreen
                ref="runHeaderFullscreen"
                runState={this.props.runState}
                bundle={this.props.bundle}
                toggleFullscreen={this._toggleFullscreen}
                onRunClick={this._run} />
        );

        return (
            <div>
                { runHeaderFullscreen }
                <div className="run-menu" style={menuStyle}>
                    <div className="left-menu">
                        <Dropdown className="path-selector" ref="Dropdown">
                            <DirectoryListing
                                onJuttleSelected={this._handleJuttleSelected}
                                juttleServiceHost={this.props.juttleServiceHost}/>
                        </Dropdown>
                        <div className="font-btn run-btn">
                            <RunButton
                                runState={this.props.runState}
                                bundle={this.props.bundle}
                                onClick={this._run}
                                runButtonText={runButtonText}
                                disabled={!this.props.bundle || !!this.props.error} />
                        </div>
                        { this._renderToggles() }
                        <div className="program-meta">
                            <div className="bundle-id">{this.props.bundleId}</div>
                        </div>
                    </div>
                    <div className="right-menu">
                        <div className="fullscreen">
                            <div className="font-btn">
                                <button className="btn btn-default" ref="btnShowFullscreen" onClick={this._toggleFullscreen}>
                                    <i className="fa fa-lg fa-expand fa-fw"></i>
                                </button>
                                <div className="font-btn-name">expand</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="program-options" style={programOptionsStyle}>
                    { juttleViewer }
                    <div ref="divLogExplorer" style={debugStyle}>
                        <LogExplorer logLines={this.props.logLines} />
                    </div>
                    <div style={inputsStyle} className="run-inputs">
                        <div ref="juttleInputsContainer" onKeyDown={this._onInputContainerKeyDown}></div>
                    </div>
                </div>
            </div>
        );
    }
}

RunHeader.PropTypes = {
    handleRun: React.PropTypes.func.required
};

export default RunHeader;
