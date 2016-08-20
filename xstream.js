var xs = require('xstream').default
var _ = require('lodash')
var Emitter = require('./transcoder')

var emitters = _.times(3, Emitter)

var loggers = {
    next: console.log.bind(console, 'progress'),
    error: console.log.bind(console, 'error'),
    complete: console.log.bind(console, 'complete')
}

function progStream (emitter) {
    var progStream = xs.create({
        start: (observer) => {
            emitter.on('progress', observer.next.bind(observer))
            emitter.on('error', observer.error.bind(observer))
            emitter.on('end', observer.complete.bind(observer))
        },
        stop: () => emitter.removeAllListeners()
    })
    return progStream
}

var progStreams = emitters.map(progStream)
var latest = xs.combine.apply(xs, progStreams)

// emit sum of all progresses
var total = latest.map((progs) => _.sum(_.map(progs, 'percent')) / 3)

total.addListener(loggers)

setTimeout(() => emitters[0].emit('error', 'test'), 1000)

