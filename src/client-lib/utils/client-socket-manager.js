export default class ClientSocketManager {
    constructor(opts) {
        if (!opts.url) {
            throw new Error('url param required');
        }

        this.socket = new WebSocket(opts.url);

        if (opts.onOpen) {
            this.onOpenCb = opts.onOpen;
            this.socket.addEventListener('open', this.onOpen.bind(this));
        }

        if (opts.onClose) {
            this.onClose = opts.onClose;
            this.socket.addEventListener('close', this.onClose.bind(this));
        }

        if (opts.onMessage) {
            this.onMessageCb = opts.onMessage;
            this.socket.addEventListener('message', this.onMessage.bind(this))
        }
    }

    onOpen() {
        this.onOpenCb();
    }

    onClose() {
        this.onCloseCb();
    }

    onMessage(event) {
        let msg = JSON.parse(event.data);

        // manage pings so the rest of the app doesn't have to
        if (msg.type === 'ping') {
            this.send({
                type: 'pong'
            });

            return;
        }

        this.onMessageCb(msg);
    }

    onError(error) {
        this.onErrorCb(error);
    }

    send(msg) {
        this.socket.send(JSON.stringify(msg));
    }

    close() {
        this.socket.close()

        this.socket.removeEventListener('open', this.onOpen)
        this.socket.removeEventListener('close', this.onClose)
        this.socket.removeEventListener('message', this.onMessage)
    }

}