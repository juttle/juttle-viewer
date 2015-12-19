import SocketManager from '../utils/client-socket-manager';
import * as Actions from '../actions';

const rendezvousMiddleware = store => {
    let { dispatch } = store

    function onMessage(msg) {
        if (msg.type === 'notify') {
            dispatch(Actions.updatePath(msg.path))
        }
    }

    let socket = new SocketManager({
        url: 'ws://localhost:8080/rendezvous/default',
        onMessage
    });

    return next => action => { next(action) }
}

export default rendezvousMiddleware

