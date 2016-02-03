import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    close() {
        this.setState({ isOpen: false });
    }

    componentDidMount() {
        document.addEventListener('click', this._handleDocumentClick, false);
    }

    componentWillUnmount() {
        document.addEventListener('click', this._handleDocumentClick, false);
    }

    _handleDocumentClick = (event) => {
        if (!ReactDOM.findDOMNode(this).contains(event.target)) {
            this.setState({ isOpen: false });
        }
    };

    _handleMouseDown = (event) => {
        if (event.type == 'mousedown' && event.button !== 0) return;

        event.stopPropagation();
        event.preventDefault();

        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        let btnGroupClasses = classnames({
            'btn-group': true,
            'open': this.state.isOpen
        });

        return (
            <div className={btnGroupClasses}>
                <button
                    className="btn btn-default dropdown-toggle"
                    onMouseDown={this._handleMouseDown}
                    onTouchEnd={this._handleMouseDown}
                    type="button">
                    <i className="fa fa-lg fa-folder-o"></i>
                </button>
                <div id="directory-listing" className="dropdown-menu">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Dropdown;
