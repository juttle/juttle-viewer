import React, { Component } from 'react'

class TextInput extends Component {
    getType() { return 'text'}

    handleChange(event) {
        this.props.inputUpdate(event.target.value)
    }

    render() {
        let { value, options } = this.props.input
        let currentValue = value ? value : ""

        let label = options.label ? <label>{options.label}</label> : false

        return (
            <div className="form-group">
                { label }
                <input
                    type={this.getType()}
                    className="form-control"
                    onChange={this.handleChange.bind(this)}
                    value={currentValue} />
            </div>
        )
    }
}

class NumberInput extends TextInput {
    getType() { return 'number'}

    handleChange(event) {
        let value = parseInt(event.target.value, 10);
        if (value !== value) {
            console.error("NumberInput: unexpected error -- target value is NaN",
                          event.target.value, value);
            return false;
        }
        this.props.inputUpdate(value)
    }
}

export default {
    text: TextInput,
    number: NumberInput
}
