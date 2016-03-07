import React, { Component } from 'react';
import classnames from 'classnames';

import { ViewStatus } from 'juttle-client-library';

class RunButton extends Component {
    render() {
        let iconClasses = classnames('fa', 'fa-fw', 'fa-lg', {
            'fa-play': this.props.runState === ViewStatus.STOPPED,
            'fa-stop': this.props.runState === ViewStatus.RUNNING,
            'fa-spin fa-refresh': this.props.runState === ViewStatus.STARTING
        });
        let btnClasses = classnames('btn', 'btn-default', 'btn-run', {
            'starting': this.props.runState === ViewStatus.STARTING,
            'running': this.props.runState === ViewStatus.RUNNING
        });

        return (
            <button
                onClick={this.props.onClick}
                disabled={!this.props.bundle}
                className={btnClasses}>
                <i className={iconClasses}></i>
                <div className="font-btn-name">{this.props.runButtonText}</div>
            </button>
        );
    }
}

export default RunButton;
