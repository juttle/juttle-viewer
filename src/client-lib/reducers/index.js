import { combineReducers } from 'redux';
import * as SinkEvents from '../utils/sink-events';
import _ from 'underscore';
import {
    JOB_CONNECTED, JOB_CONNECTING, JOB_CONNECT_REQUEST, JOB_START, SINK_EVENT,
    INPUT_UPDATE, INPUT_DEFS_UPDATE, INPUT_VALUE_UPDATE,
    PROGRAM_UPDATE,
    MODULES_UPDATE
} from '../actions';
import Immutable from 'immutable';


function websocketStatus(state = 'INACTIVE', action) {
    switch (action.type) {
        case JOB_CONNECTING:
            return 'CONNECTING'
        case JOB_CONNECTED:
            return 'CONNECTED'
        default:
            return state
    }
}

function sinks(state = new Map(), action) {
    switch (action.type)    {
        case JOB_START:
            let sinks = new Map()

            action.sinks.forEach(sink => {
                sinks.set(sink.sink_id, sink)
            })

            return sinks
        case SINK_EVENT:
            SinkEvents.emitMessage(action.msg.sink_id, action.msg);
            break;
    }

    return state
}

function program(state = "", action) {
    switch(action.type) {
        case PROGRAM_UPDATE:
            return action.program;
    }

    return state;
}

function modules(state = {}, action) {
    switch(action.type) {
        case MODULES_UPDATE:
            return action.modules || {};
    }

    return state;
}

function job(state = {}, action) {
    switch (action.type) {
        case JOB_START:
            return {
                job_id: action.job_id
            };
    }

    return state;
}

let inputsDefault = {
    currentInputs: Immutable.Map(),
    originalInputs: Immutable.Map()
}

function inputs(state = [], action) {
    switch (action.type) {
        case INPUT_DEFS_UPDATE:
            return action.inputs;

        case INPUT_VALUE_UPDATE:
            return state.map((input) => {
                if (input.id === action.input_id) {
                    return Object.assign({}, input, {
                        value: action.value
                    });
                }
                else {
                    return input;
                }
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    websocketStatus,
    program,
    modules,
    sinks,
    inputs,
    job
})

export default rootReducer
