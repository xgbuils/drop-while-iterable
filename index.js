const arrayOf = require('immutable-array.of')
const push = require('immutable-array.push')
const findIndexFrom = require('immutable-array.find-index-from')

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

function generator () {
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

module.exports = {
    of (iterable) {
        return {
            iterable,
            ps: arrayOf([]),
            [Symbol.iterator]: generator
        }
    },
    dropWhile (p, dropWhileIterable) {
        return {
            ps: push(p, dropWhileIterable.ps),
            iterable: dropWhileIterable.iterable,
            [Symbol.iterator]: generator
        }
    }
}
