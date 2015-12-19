import React, { Component, PropTypes } from 'react'
import InputTypes from './input-types'
import { updateInput } from '../actions'
import { connect } from 'react-redux';

class InputContainer extends Component {
    inputUpdate(newValue) {
        this.props.dispatch(updateInput(this.props.input.id, newValue));
    }

    render() {
        let { input } = this.props
        let ReactComponent = InputTypes[input.type]
        return (
            <div data-input-id={input.id} data-input-label={input.options.label}>
                <ReactComponent input={input} inputUpdate={this.inputUpdate.bind(this)}/>
            </div>
        )
    }
}

InputContainer.propTypes = {
    input: PropTypes.object.isRequired
}

export default connect()(InputContainer);
