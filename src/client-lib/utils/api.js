import fetch from 'isomorphic-fetch';

const BASE_URL = "http://localhost:8080";
const API_PREFIX = "/api/v0";

export let getInputs = (bundle, inputs) => {
    return fetch(`${BASE_URL}${API_PREFIX}/prepare`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bundle,
            inputs
        })
    })
    .then(res => res.json());
};

export let runJob = (bundle, inputs) => {
    return fetch(`${BASE_URL}${API_PREFIX}/jobs`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bundle,
            inputs
        })
    })
    .then(res => res.json());
};

export let getJob = (jobId) => {
    return fetch(`${BASE_URL}${API_PREFIX}/jobs/${jobId}`)
    .then(res => res.json());
};

export let getBundle = (path) => {
    return fetch(`${BASE_URL}${API_PREFIX}/paths${path}`)
    .then(res => res.json());
};
