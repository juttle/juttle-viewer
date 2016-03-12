import React, { Component } from 'react';
import classnames from 'classnames';

import RunButton from './run-button';

class RunHeaderFullscreen extends Component {
    constructor() {
        super();

        this.state = {
            fullscreenMenu: false
        };
    }

    _toggleFullscreenMenu = () => {
        this.setState({
            fullscreenMenu: !this.state.fullscreenMenu
        });
    };

    render() {
        let menu = !this.state.fullscreenMenu ? false : (
            <div className="btn-group" >
                <RunButton
                    runState={this.props.runState}
                    bundle={this.props.bundle}
                    onClick={this.props.onRunClick}
                    disabled={!this.props.bundle} />
                <button className="btn btn-default" ref="btnHideFullscreen" onClick={this.props.toggleFullscreen}>
                    <i className="fa fa-compress fa-fw"></i>
                </button>
            </div>
        );

        let toggleClasses = classnames('fa', {
            'fa-angle-double-left': !this.state.fullscreenMenu,
            'fa-angle-double-right': this.state.fullscreenMenu
        });

        return (
            <div className="run-menu-fullscreen">
                {menu}
                <button onClick={this._toggleFullscreenMenu} className="btn btn-fullscreen-menu">
                    <i className={toggleClasses}></i>
                </button>
            </div>
        );
    }
}

export default RunHeaderFullscreen;
