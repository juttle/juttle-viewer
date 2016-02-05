import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistory } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers';
import { bundleMiddleware } from './middleware';

import App from './components/app';
import Run from './components/run';


// import sass
import 'juttle-client-library/dist/juttle-client-library.css';
import 'font-awesome/css/font-awesome.css';
import './assets/sass/main.scss';

// setup redux
const reduxRouterMiddeware = syncHistory(browserHistory);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddeware, bundleMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers, { juttleEngineHost: window.JUTTLE_ENGINE_HOST });

// setup main app
ReactDOM.render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Run} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));
