var _ = require('lodash')
var Emitter = require('./transcoder')
var Rx = require('rx')

var es = _.times(3, Emitter)

function progStream (emitter) {
    var progStream = Rx.Observable.create((observer) => {
        emitter.on('progress', observer.onNext.bind(observer))
        emitter.on('error', observer.onError.bind(observer))
        emitter.on('end', observer.onCompleted.bind(observer))
    })
    return progStream
}

var loggers = [
    console.log.bind(console, 'progress'),
    console.log.bind(console, 'error'),
    console.log.bind(console, 'complete')
]

function subscribe (progStream, i) {
    var subscription = progStream.subscribe(
        console.log.bind(console, 'progress', i),
        console.log.bind(console, 'error', i),
        console.log.bind(console, 'complete', i)
    )
    return subscription
}

var ps = es.map(progStream)
// var subs = ps.map(subscribe)

var latest = ps.reduce((p1, p2) => p1.combineLatest(p2, (v1, v2) => {
    return _.flatten([v1].concat(v2))
}))
// latest.subscribe.apply(latest, loggers)

var total = latest.map((progs) => _.sum(_.map(progs, 'percent')) / 3)
total.subscribe.apply(total, loggers)

setTimeout(() => es[0].emit('error', 'test'), 1000)

// when one transcode errors, we need to stop the others
