import React from 'react';
import { connect } from 'react-redux';

import DirectoryListing from '../../client-lib/directory-listing';
import Dropdown from '../../client-lib/dropdown';

class Header extends React.Component {
    handleJuttleSelected = () => {
        this.refs.Dropdown.close();
    };

    render() {
        return (
            <header>
                <div className='header-options'>
                    <Dropdown ref="Dropdown">
                        <DirectoryListing
                            onJuttleSelected={this.handleJuttleSelected}
                            juttleServiceHost={this.props.juttleServiceHost}/>
                    </Dropdown>
                </div>
            </header>
        );
    }
}

function select(state) {
    return {
        juttleServiceHost: state.juttleServiceHost
    };
}

export default connect(select)(Header);
