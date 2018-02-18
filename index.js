const arrayOf = require('immutable-array.of')
const push = require('immutable-array.push')
const findIndexFrom = require('immutable-array.find-index-from')

function dropWhile (p) {
    const obj = Object.create(this.constructor.prototype)
    obj.ps = push(p, this.ps)
    obj.iterable = this.iterable
    return obj
}

function DropWhileIterable (iterable) {
    this.iterable = iterable
    this.ps = arrayOf([])
}

function init () {
    this.index = 0
}

function apply (value) {
    const index = this.index
    if (index !== -1) {
        this.index = findIndexFrom(index, f => f(value), this.ps)
    }
    return this.index === -1 ? {value} : undefined
}

Object.defineProperties(DropWhileIterable.prototype, {
    dropWhile: {
        value: dropWhile
    },
    [Symbol.iterator]: {
        value () {
            init.call(this)
            const self = this
            const iterator = this.iterable[Symbol.iterator]()
            let status
            return {
                next () {
                    while (!(status = iterator.next()).done) {
                        status = apply.call(self, status.value)
                        if (status) {
                            return status
                        }
                    }
                    return {done: true}
                }
            }
        }
    }
})

module.exports = DropWhileIterable
