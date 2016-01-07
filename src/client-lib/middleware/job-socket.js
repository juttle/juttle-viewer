import SocketManager from '../utils/client-socket-manager';
import * as Actions from '../actions'


const jobMiddleware = store => {
    let socket;
    let { dispatch } = store

    function onOpen(job_id) {
        dispatch(Actions.jobConnected(job_id))
    }

    function onMessage(job_id, msg) {
        // got to convert time to a Date obj
        if (msg.hasOwnProperty('time')) {
            msg.time = new Date(msg.time);
        }

        if (msg.hasOwnProperty('points')) {
            msg.points.forEach(point => {
                if (point.hasOwnProperty('time')) {
                    point.time = new Date(point.time);
                }
            });
        }

        if (msg.hasOwnProperty('sinks')) {
            msg.sinks.forEach((sink) => {
                sink.options._jut_time_bounds.forEach((timeBound) => {
                    if (timeBound.from) {
                        timeBound.from = new Date(timeBound.from);
                    }

                    if (timeBound.to) {
                        timeBound.to = new Date(timeBound.to);
                    }
                });
            });
        }

        dispatch(Actions.jobMessage(job_id, msg))
    }

    return next => action => {
        if (action.type === Actions.JOB_CONNECT_REQUEST) {
            if (socket) {
                socket.close();
            }

            socket = new SocketManager({
                url: `ws://${window.location.host}/api/v0/jobs/${action.job_id}`,
                onOpen: onOpen.bind(null, action.job_id),
                onMessage: onMessage.bind(null, action.job_id)
            });
        }
        next(action);
    }
}

export default jobMiddleware
