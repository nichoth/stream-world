// var xs = require('xstream').default
var pull = require('pull-stream')
var Pushable = require('pull-pushable')
var _ = require('lodash')
var Emitter = require('./transcoder')

var emitters = _.times(3, Emitter)

var loggers = {
    next: console.log.bind(console, 'progress'),
    error: console.log.bind(console, 'error'),
    complete: console.log.bind(console, 'complete')
}

function progStream (emitter) {
    var pushable = Pushable((err) => console.log('error', err))
    emitter.on('progress', pushable.push.bind(pushable))
    emitter.on('end', pushable.end.bind(pushable))
    return pushable

    // return function progress (abort, cb) {
    //     if (abort) return cb(true)
    //     // emitter.on('error', cb.bind(null))
    //     // emitter.on('end', cb.bind(null, true))
    //     emitter.on('progress', function onProg (prog) {
    //         emitter.removeListener('progress', onProg)
    //         cb(null, prog)
    //     })
    // }
}

function sink (read) {
    read(null, function next (err, data) {
        if (err) return console.log('error', err)
        console.log('data', data)
        read(null, next)
    })
}

sink(progStream(emitters[0]))

// function progStream (emitter) {
//     var progStream = xs.create({
//         start: (observer) => {
//             emitter.on('progress', observer.next.bind(observer))
//             emitter.on('error', observer.error.bind(observer))
//             emitter.on('end', observer.complete.bind(observer))
//         },
//         stop: () => emitter.removeAllListeners()
//     })
//     return progStream
// }

// var progStreams = emitters.map(progStream)
// var latest = xs.combine.apply(xs, progStreams)

// // emit sum of all progresses
// var total = latest.map((progs) => _.sum(_.map(progs, 'percent')) / 3)

// total.addListener(loggers)

// setTimeout(() => emitters[0].emit('error', 'test'), 1000)


