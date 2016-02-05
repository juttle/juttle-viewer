import React, { Component } from 'react';

import Entry from './entry';
import { getDirectory } from '../api';
import path from 'path';

class DirectoryListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
            directories: [],
            juttles: []
        };

    }

    componentDidMount() {
        this.fetchDirectory('/');
    }

    fetchDirectory(currentPath) {
        getDirectory(this.props.juttleEngineHost, currentPath)
        .then(list => {
            this.setState(Object.assign({}, list, { status: 'ready' }));
        })
    }

    onEntryClick = (name, type) => {
        let newPath = path.join(this.state.path, name);
        if (type === 'directory') {
            this.fetchDirectory(newPath);
        } else {
            this.props.onJuttleSelected(newPath, type);
        }

    };

    renderNothingGoingOn() {
        if (this.state.directories.length === 0 && this.state.juttles.length === 0) {
            return (<div className="dir-list-item">Nothing Going On Here</div>);
        }
    }

    renderGoBack() {
        if (!this.state.is_root) {
            let backPath = path.normalize(path.join(this.state.path, '..'));
            return (
                <a href="#" onClick={this.fetchDirectory.bind(this, backPath)}>
                    <i className="fa fa-lg fa-angle-double-left"></i>
                </a>
            )
        }

        return false;
    }

    renderEntries(entries, type) {
        let self = this;
        let entriesList = entries.map(entry => {
            return (
                <Entry
                    key={entry}
                    currentPath={self.state.path}
                    name={entry}
                    onClick={self.onEntryClick}
                    type={type} />
            )
        });

        return (
            <div className="entry-list">
                {entriesList}
            </div>
        );
    }

    render() {
        if (this.state.status === 'loading') {
            return (<div>Loading</div>);
        }


        return (
            <div className="dir-list">
                <div className="dir-list-item path">
                    <span>
                        {this.state.path}
                        &nbsp;&nbsp;
                        {this.renderGoBack()}
                    </span>
                </div>
                {this.renderNothingGoingOn()}
                {this.renderEntries(this.state.directories, 'directory')}
                {this.renderEntries(this.state.juttles, 'juttle')}
            </div>
        );
    }
}

DirectoryListing.PropTypes = {
    onJuttleSelected: React.PropTypes.func.isRequired
};

export default DirectoryListing;
