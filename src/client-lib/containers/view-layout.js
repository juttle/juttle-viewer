import _ from 'underscore';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Sink from '../components/sink';
import sinkLayoutGen from '../utils/sink-layout-gen';

class ViewLayout extends Component {
    generateViewColumns(sinkCols) {
        return sinkCols.map(sinkCol => {
            let sink = this.props.sinks.get(sinkCol);
            return (
                <Sink
                    sink={sink}
                    width={100 / sinkCols.length}
                    key={sink.sink_id}/>
            )
        });
    }

    render() {
        let { sinks, sinkLayout, job } = this.props;
        let rows = sinkLayout.map((sinkRow, index) => {
            return (
                <div className="flex-row" key={index}>
                    {this.generateViewColumns(sinkRow)}
                </div>
            )
        })

        return (
            <div className="juttle-view sink-views" key={job.job_id}>
                {rows}
            </div>
        );

    }
}

export default connect(
    state => {
        return {
            sinks: state.sinks,
            sinkLayout: sinkLayoutGen(state.sinks),
            job: state.job
        };
    }
)(ViewLayout)
