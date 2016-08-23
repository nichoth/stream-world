var EE = require('events').EventEmitter

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = function () {
    var ee = new EE()
    var total = random(20, 50)

    function emitProgress (oldValue) {
        var newValue = oldValue + random(1, 5)
        ee.emit('progress', { percent: newValue, total: total })
        if (oldValue >= 100) {
            return ee.emit('end', { result: 'this is the end' })
        }
        setTimeout(emitProgress.bind(null, newValue), random(0, 500))
    }

    process.nextTick(emitProgress.bind(null, 0))

    return ee
}
