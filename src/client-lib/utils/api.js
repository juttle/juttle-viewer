import fetch from 'isomorphic-fetch';

const API_PREFIX = "/api/v0";

export let getBundle = (path) => {
    return fetch(`${API_PREFIX}/paths${path}`)
    .then(res => res.json());
};
