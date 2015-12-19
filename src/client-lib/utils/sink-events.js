var EventEmitter = require('eventemitter3')
var events = new EventEmitter()

export function emitMessage(sink, msg) {
    events.emit(sink, msg)
}

export function addSink(sink, fn, context) {
    events.addListener(sink, fn, context)
}

export function removeSink(sink, fn) {
    events.removeListener(sink, fn)
}