import React from 'react';

import DirectoryListing from '../client-lib/directory-listing';
import Dropdown from '../client-lib/dropdown';

class App extends React.Component {
    handleJuttleSelected = () => {
        this.refs.Dropdown.close();
    };

    render() {
        return (
            <div className="app-wrapper">
                <header>
                    <div className='header-options'>
                        <Dropdown ref="Dropdown">
                            <DirectoryListing onJuttleSelected={this.handleJuttleSelected}/>
                        </Dropdown>
                    </div>
                </header>
                {this.props.children}
            </div>
        )
    }
}

export default App;
