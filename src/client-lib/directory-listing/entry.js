import React, { Component } from 'react';
import { Link } from 'react-router';
import path from 'path';

class Entry extends Component {
    handleClick = () => {
        let { name, type } = this.props;
        this.props.onClick(name, type);
    };

    render() {
        let { name, type, currentPath } = this.props;
        let classNames = `dir-list-item dir-entry dir-entry-${type}`;
        let entryPath = path.join(currentPath, name);

        if (type === 'juttle') {
            return (
                <Link
                    to={{ pathname: '/', query: { path: entryPath }}}
                    onClick={this.handleClick}
                    className={classNames}>
                    {name}
                </Link>
            )
        }

        return (
            <a className={classNames} onClick={this.handleClick} role="button">
                <i className="fa fa-lg fa-folder-o"></i>&nbsp;&nbsp;{name}
            </a>
        );
    }
}

Entry.propTypes = {
    currentPath: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(['juttle', 'directory']).isRequired,
    onClick: React.PropTypes.func.isRequired
}

export default Entry
