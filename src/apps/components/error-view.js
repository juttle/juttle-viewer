import React from 'react';
import Juttle from 'juttle-client-library';

export default class ErrorView extends React.Component {
    componentDidMount() {
        let client = new Juttle(this.props.juttleServiceHost);
        this.error = new client.Errors(this.refs.errorDiv);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.error) {
            this.error.clear();
        } else {
            this.error.render(nextProps.error);
        }
    }

    render() {
        return (
            <div ref="errorDiv"></div>
        );
    }
}

