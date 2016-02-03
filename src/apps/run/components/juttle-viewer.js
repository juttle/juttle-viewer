import React, { Component } from 'react';

class JuttleViewer extends Component {
    constructor() {
        super();
        this.state = {
            sourceVisible: false
        };
    }

    _onToggleVisiblityClick() {
        this.setState({
            sourceVisible: !this.state.sourceVisible
        });
    }

    render() {
        if (!this.props.bundle) {
            return false;
        }

        let bundle = false;

        if (this.state.sourceVisible) {
            bundle = (<pre className='juttle-source'>{this.props.bundle.program}</pre>);
        }

        return (
            <div>
                <a className='juttle-source-toggle' onClick={this._onToggleVisiblityClick.bind(this)}>
                    {this.state.sourceVisible ? 'Hide Juttle' : 'Show Juttle'}
                </a>
                {bundle}
            </div>
        )
    }
}

JuttleViewer.PropTypes = {
    bundle: React.PropTypes.object
};

export default JuttleViewer;
