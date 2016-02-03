import EventEmitter from 'eventemitter3';

class RendezvousSocket extends EventEmitter {
    constructor(url) {
        // instantiate super EventEmitter
        super();

        // setup websocket
        this._socket = new WebSocket(url);

        this._socket.onopen = (event) => { this.emit('open'); };
        this._socket.onclose = (event) => { this.emit('close'); };
        this._socket.onmessage = this._onMessage.bind(this);
        this._socket.onerror = this._onError.bind(this);
    }

    _onError(event) {
        this.emit('error', JSON.parse(event.data));
    }

    _onMessage(event) {
        let msg = JSON.parse(event.data);

        // manage pings so the rest of the app doesn't have to
        if (msg.type === 'ping') {
            this._socket.send(JSON.stringify({
                type: 'pong'
            }));

            return;
        }

        this.emit('message', msg);
    }

    close() {
        this._socket.close();
        this._socket = null;
    }

}

export default RendezvousSocket;
