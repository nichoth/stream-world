var Observable = require('rxjs/Observable').Observable
require('rxjs/add/operator/map')
require('rxjs/add/operator/combineLatest')
var Emitter = require('./transcoder')

var emitters = [];
for (var i = 0; i <= 2; i++) {
    emitters.push(Emitter());
}

function progStream (emitter) {
    var progStream = Observable.create((observer) => {
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
    return p1.combineLatest(p2, (v1, v2) => [v1].concat(v2))
})

// emit sum of all progresses
var total = latest.map((progs) => progs.reduce((total, prog) => {
    return total + prog.percent
}))

total.subscribe(loggers)

setTimeout(() => emitters[0].emit('error', 'test'), 1000)

