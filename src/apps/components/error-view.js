import React from 'react';
import { Errors } from 'juttle-client-library';

console.log('errors', Errors);

export default class ErrorView extends React.Component {
    componentDidMount() {
        this.error = new Errors(this.refs.errorDiv);
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
