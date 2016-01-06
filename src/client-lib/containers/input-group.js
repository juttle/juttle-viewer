import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import InputContainer from '../components/input-container';

class InputGroup extends Component {
    _onKeyUp = (e) => {
        if (e.keyCode === 13 && e.shiftKey) {
            this.props.onRun();
        }
    };

    render() {
        const { inputs } = this.props;
        if (inputs.size === 0) {
            return false;
        }

        return (
            <div onKeyUp={this._onKeyUp} className="juttle-view inputs-view">
                {inputs.map((input) => <InputContainer key={input.id} input={input} />)}
            </div>
        )
    }
}

InputGroup.propTypes = {
    inputs: PropTypes.array.isRequired
}

export default connect(
    state => {
        return {
            inputs: state.inputs
        }
    }
)(InputGroup);
