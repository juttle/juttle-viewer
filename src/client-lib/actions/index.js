import fetch from 'isomorphic-fetch'

import {runJob} from '../utils/api';

export const JOB_CONNECT_REQUEST = 'JOB_CONNECT_REQUEST'
export const JOB_CONNECTING = 'JOB_CONNECTING'
export const JOB_CONNECTED = 'JOB_CONNECTED'

// BEGIN INPUT ACTIONS
export const INPUT_DEFS_UPDATE = 'INPUT_DEFS_UPDATE'
export const INPUT_VALUE_UPDATE = 'INPUT_VALUE_UPDATE'
// END INPUT ACTIONS

export const MODULES_UPDATE = 'MODULES_UPDATE';

export const PROGRAM_UPDATE = 'PROGRAM_UPDATE';

export function jobConnecting() {
    return { type: JOB_CONNECTING };
}

export function jobConnected() {
    return { type: JOB_CONNECTED };
}

/* Jobs */
export const JOB_START = 'JOB_START'
export const JOB_END = 'JOB_END'
export const SINK_EVENT = 'SINK_EVENT'


export function jobMessage(job_id, msg) {
    switch (msg.type) {
        case 'job_start':
            return {
                type: JOB_START,
                sinks: msg.sinks,
                inputs: msg.inputs,
                job_id: job_id
            };
        default:
            return {
                type: SINK_EVENT,
                msg: msg
            };
    }
}

export function updateInput(input_id, value) {
    return {
        type: INPUT_VALUE_UPDATE,
        input_id: input_id,
        value: value
    };
}

/* Rendezvous Socket */
function jobConnect(job_id) {
    return {
        type: JOB_CONNECT_REQUEST,
        job_id
    };
}

export function runBundle() {
    return (dispatch, getState) => {
        let { program, modules, inputs } = getState();
        inputs = inputs.reduce((result, input) => {
            result[input.id] = input.value;
            return result;
        }, {});

        const bundle = {
            program,
            modules
        };

        runJob(bundle, inputs)
            .then((job) => {
                dispatch(jobConnect(job.job_id));
            });
    };
}

export let updateInputDefs = (inputs) => {
    return {
        type: INPUT_DEFS_UPDATE,
        inputs
    };
};

export let updateProgram = (program) => {
    return {
        type: PROGRAM_UPDATE,
        program
    };
};

export let updateModules = (modules) => {
    return {
        type: MODULES_UPDATE,
        modules
    };
};

export function updatePath(path) {
    return dispatch => {
        fetch('http://localhost:8080/api/v0/paths/' + path)
        .then(res => res.json())
        .then(bundle => {
            return fetch('http://localhost:8080/api/v0/jobs', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bundle)
            });
        })
        .then(res => res.json())
        .then(job => dispatch(jobConnect(job.job_id)));
    };
}
