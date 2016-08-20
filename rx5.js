var Rx = require('rxjs/Rx')
var _ = require('lodash')
var Emitter = require('./transcoder')

var emitters = _.times(3, Emitter)

function progStream (emitter) {
    var progStream = Rx.Observable.create((observer) => {
        emitter.on('progress', observer.next.bind(observer))
        emitter.on('error', observer.error.bind(observer))
        emitter.on('end', observer.complete.bind(observer))
    })
    return progStream
}

var loggers = {
    next: console.log.bind(console, 'progress'),
    error: console.log.bind(console, 'error'),
    complete: console.log.bind(console, 'complete')
}

var progStreams = emitters.map(progStream)

// emit data from all streams at once
var latest = progStreams.reduce((p1, p2) => {
    return p1.combineLatest(p2, (v1, v2) => _.flatten([v1].concat(v2)))
})

// emit sum of all progresses
var total = latest.map((progs) => _.sum(_.map(progs, 'percent')) / 3)

total.subscribe(loggers)

setTimeout(() => emitters[0].emit('error', 'test'), 1000)

