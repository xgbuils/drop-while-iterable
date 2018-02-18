const test = require('tape')
const tapSpec = require('tap-spec')

const DropWhileIterable = require('./')

const emptySet = new Set()
const emptyMap = new Map()
const arrayFromOneToFive = Object.freeze([1, 2, 3, 4, 5])
const lowerThanThree = e => e < 3
const arrayFromThreeToFive = Object.freeze([3, 4, 5])
const arrayMap = [['one', 1], ['two', 2], ['three', 3]]
const setFromOneToFive = new Set(arrayFromOneToFive)
const map = new Map(arrayMap)

test('constructor', function (t) {
    t.test('empty set', function (st) {
        const iterable = new DropWhileIterable(emptySet)
        st.deepEqual([...iterable], [],
            'must return an empty iterable')
        st.end()
    })
    t.test('non-empty set', function (st) {
        const iterable = new DropWhileIterable(setFromOneToFive)
        st.deepEqual([...iterable], arrayFromOneToFive,
            'must return an iterable with the same values')
        st.end()
    })

    t.test('empty map', function (st) {
        const iterable = new DropWhileIterable(emptyMap)
        st.deepEqual([...iterable], [],
            'must return an empty iterable')
        st.end()
    })
    t.test('non-empty string', function (st) {
        const iterable = new DropWhileIterable(map)
        st.deepEqual([...iterable], arrayMap,
            'must return an iterable with the same values')
        st.end()
    })

    t.end()
})

test('dropWhile', function (t) {
    t.test('empty array', function (st) {
        const iterable = new DropWhileIterable(emptySet)
            .dropWhile(() => true)
        st.deepEqual([...iterable], [],
            'must return an empty iterable')
        st.end()
    })
    t.test('dropping some first values matches', function (st) {
        const iterable = new DropWhileIterable(setFromOneToFive)
            .dropWhile(lowerThanThree)
        st.deepEqual([...iterable], arrayFromThreeToFive,
            'must return and iterable with the first matched values removed')
        st.end()
    })
    t.test('dropping all values', function (st) {
        const iterable = new DropWhileIterable(setFromOneToFive)
            .dropWhile(() => true)
        st.deepEqual([...iterable], [],
            'must return empty iterable if all values match')
        st.end()
    })
    t.test('dropping zero items', function (st) {
        const iterable = new DropWhileIterable(setFromOneToFive)
            .dropWhile(e => e > 1)
        st.deepEqual([...iterable], arrayFromOneToFive,
            'must not drop any value if the first value of iterable does not match')
        st.end()
    })
    t.test('chaining', function (st) {
        const iterable = new DropWhileIterable(setFromOneToFive) // (1 2 3 4 5)
            .dropWhile(e => e % 2 === 1) // (2 3 4 5)
            .dropWhile(e => e % 2 === 0) // (3 4 5)
            .dropWhile(e => e % 2 === 1) // (4 5)
        st.deepEqual([...iterable], [4, 5],
            'must remove values over the result of previous dropWhile')
        st.end()
    })
    t.test('traversing multiple times (chaining)', function (st) {
        const iterable = new DropWhileIterable(setFromOneToFive) // (1 2 3 4 5)
            .dropWhile(e => e % 2 === 1) // (2 3 4 5)
            .dropWhile(e => e % 2 === 0) // (3 4 5)
            .dropWhile(e => e % 2 === 1) // (4 5)
        for (const item of iterable) { // eslint-disable-line no-unused-vars
            // ...
        }
        st.deepEqual([...iterable], [4, 5],
            'must return the same values if it is traversed multiple times')
        st.end()
    })

    t.test('using intermediate iterables', function (st) {
        const intermediate = new DropWhileIterable(setFromOneToFive)
            .dropWhile(lowerThanThree) // (3 4 5)
        const first = intermediate
            .dropWhile(e => e === 3) // (4 5)
        const second = intermediate
            .dropWhile(e => e !== 5) // (5)
        st.deepEqual([...first], [4, 5],
            'first result must be correct')
        st.deepEqual([...second], [5],
            'second result must be correct')
        st.end()
    })
    t.end()
})

test.createStream()
    .pipe(tapSpec())
    .pipe(process.stdout)
