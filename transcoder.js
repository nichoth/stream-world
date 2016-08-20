var _ = require('lodash')
var EE = require('events').EventEmitter

module.exports = function () {
    var ee = new EE()
    var total = _.random(20, 50)

    function emitProgress (oldValue) {
        var newValue = oldValue + _.random(1, 5)
        ee.emit('progress', { percent: newValue, total: total })
        if (oldValue >= 100) {
            return ee.emit('end', { result: 'this is the end' })
        }
        setTimeout(emitProgress.bind(null, newValue), _.random(500))
    }

    process.nextTick(emitProgress.bind(null, 0))

    return ee
}
