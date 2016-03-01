import React from 'react';

const JuttleViewer = (props) => {
    return (
        <pre className='juttle-source'>{props.bundle.program}</pre>
    );
}

export default JuttleViewer;
