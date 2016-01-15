import React, { Component } from "react";

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
        let juttleSource = false;

        if (this.state.sourceVisible) {
            juttleSource = (<pre className="juttle-source">{this.props.juttleSource}</pre>);
        }

        return (
            <div>
                <a className="juttle-source-toggle" onClick={this._onToggleVisiblityClick.bind(this)}>
                    {this.state.sourceVisible ? "Hide Juttle" : "Show Juttle"}
                </a>
                {juttleSource}
            </div>
        )
    }
}

export default JuttleViewer;
