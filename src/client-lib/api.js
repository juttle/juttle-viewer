import fetch from 'isomorphic-fetch';

const API_PREFIX = '/api/v0';

function makeRequest(uri, options) {
    return fetch(uri, options)
    .then(res => {
        return res.json()
        .then(body => {
            return [res, body];
        });
    })
    .then(([res, body]) => {
        if (res.status >= 200 && res.status < 300) {
            return body;
        } else {
            let error = new Error(body.message);
            error.code = body.code;
            error.info = body.info;
            throw error;
        }
    });
}

export let getBundle = (path) => {
    return makeRequest(`${API_PREFIX}/paths${path}`);
};

export let describe = (bundle) => {
    return makeRequest(`${API_PREFIX}/prepare`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bundle,
            inputs: {}
        })
    });
}

export let getDirectory = (path) => {
    path = path || '/';
    return makeRequest(`${API_PREFIX}/directory?path=${path}`);
};
