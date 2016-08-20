var _ = require('lodash')
var EE = require('events').EventEmitter

module.exports = function () {
    var ee = new EE()
    var total = _.random(20, 50)

    function emitProgress (i) {
        ee.emit('progress', { percent: i, total: total })
        if (i === 100) return
        setTimeout(emitProgress.bind(null, i+1), _.random(500))
    }

    process.nextTick(emitProgress.bind(null, 0))

    return ee
}