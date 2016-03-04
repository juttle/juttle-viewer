import React from 'react';
import classnames from 'classnames';

import DirectoryListing from '../../client-lib/directory-listing';
import Dropdown from '../../client-lib/dropdown';
import JuttleViewer from './juttle-viewer';
import JuttleEditor from './juttle-editor';
import { newBundle } from '../actions';

const ENTER_KEY = 13;

class RunHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            showJuttle: false,
            editJuttle: false,
            fullscreen: false
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
            showJuttle: !this.state.showJuttle,
            editJuttle: false
        });
    };

    _toggleEditJuttle = () => {
        var newEditState = !this.state.editJuttle;
        this.setState({
            editJuttle: newEditState,
            showJuttle: false
        });

        if (newEditState) {
            this.props.dispatch(newBundle('local', {program: ''}, {}));
        }
    }

    _handleJuttleSelected = () => {
        this.refs.Dropdown.close();
    };

    _renderToggles() {
        let fontBtnClasses = classnames({
            'font-btn': true,
            'active': this.state.showJuttle
        });

        return (
            <div className={fontBtnClasses}>
                <button
                    onClick={this._toggleShowJuttle}
                    className="btn btn-default">
                    <i className="fa fa-lg fa-fw fa-code"></i>
                </button>
                <div className="font-btn-name">view</div>
            </div>
        );
    }

    _toggleFullscreen = () => {
        this.setState({
            fullscreen: !this.state.fullscreen
        });
    };

    _renderFullscreen() {
        let style = {
            'display': this.state.fullscreen ? '' : 'none'
        };

        return (
            <div className="run-menu-fullscreen btn-group" style={style}>
                <button
                    onClick={this.props.onRunClick}
                    disabled={!this.props.bundle}
                    className="run-btn btn btn-default">
                    <i className="fa fa-play fa-fw"></i>
                </button>
                <button className="btn btn-default" ref="btnHideFullscreen" onClick={this._toggleFullscreen}>
                    <i className="fa fa-compress fa-fw"></i>
                </button>
            </div>
        );
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

        let juttleViewer = this.props.bundle && this.state.showJuttle ? <JuttleViewer bundle={this.props.bundle} /> : false;
        let juttleEditor = this.state.editJuttle ? <JuttleEditor bundle={this.props.bundle} dispatch={this.props.dispatch} />: null;

        let runModeText = 'Not Set';
        if (this.props.runMode.path || this.props.runMode.rendezvous) {
            runModeText = this.props.runMode.path ? 'Path' : 'Rendezvous';
        }

        return (
            <div>
                { this._renderFullscreen() }
                <div className="run-menu" style={menuStyle}>
                    <div className="left-menu">
                        <Dropdown className="path-selector" ref="Dropdown">
                            <DirectoryListing
                                onJuttleSelected={this._handleJuttleSelected}
                                juttleServiceHost={this.props.juttleServiceHost}/>
                        </Dropdown>
                        <div className="font-btn new-btn">
                            <button
                                onClick={this._toggleEditJuttle}
                                className=" btn btn-default">
                                <i className="fa fa-plus fa-lg fa-fw"></i>
                            </button>
                            <div className="font-btn-name">new</div>
                        </div>
                        <div className="font-btn run-btn">
                            <button
                                onClick={this.props.onRunClick}
                                disabled={!this.props.bundle}
                                className=" btn btn-default">
                                <i className="fa fa-play fa-lg fa-fw"></i>
                            </button>
                            <div className="font-btn-name">run</div>
                        </div>
                        <div className="run-menu-toggles">
                            { this._renderToggles() }
                        </div>
                        <div className="program-meta">
                            <div className="bundle-id">{this.props.bundleId}</div>
                            <div className="run-mode">
                                <span className="run-mode-title">run mode:</span>
                                &nbsp;
                                <span className="run-mode-text">{runModeText}</span>
                            </div>
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
                    <div style={inputsStyle} className="run-inputs">
                        <div ref="juttleInputsContainer" onKeyDown={this._onInputContainerKeyDown}></div>
                    </div>
                </div>
                <div className="program-options" style={programOptionsStyle}>
                    { juttleEditor }
                </div>
            </div>
        );
    }
}

RunHeader.PropTypes = {
    onRunClick: React.PropTypes.func.required
};

export default RunHeader;
