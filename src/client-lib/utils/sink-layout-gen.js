import _ from 'underscore';

// handle undefined cols or rows
let compare = (a, b) => {
    if (a === b) {
        return 0
    } else if (!_.isNumber(a)) {
        return 1;
    } else if (!_.isNumber(b)) {
        return -1;
    } else {
        return a - b;
    }
}

export default (sinks) => {
    if (!sinks) { return []; }
    let sinkArr = Array.from(sinks.values());

    // group by row number, concat unspecified at end of array
    let groupSinks = _.groupBy(sinkArr, sink => {
        return _.isNumber(sink.options.row) ? sink.options.row : 'noRowSpecified';
    });

    let noRow = groupSinks['noRowSpecified'] || [];
    delete groupSinks['noRowSpecified'];

    sinkArr = _.values(groupSinks);

    noRow.forEach(sink => {
        sinkArr.push([sink]);
    });

    // order rows
    sinkArr.sort((sinkArrA, sinkArrB) => {
        return compare(sinkArrA[0].options.row, sinkArrB[0].options.row);
    });

    // order columns
    return sinkArr.map(sinks => {
        sinks.sort((sinkA, sinkB) => {
            return compare(sinkA.options.col, sinkB.options.col);
        });

        // clean this up a bit
        let arr = [];
        sinks = sinks.forEach((sink) => {
            arr.push(sink.sink_id);
        });

        return arr;
    });
}
