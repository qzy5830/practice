// flat方法(ES5+apply实现)
Array.prototype.applyFlat = function (depth) {
  depth = depth || 1

  var newArr = []

  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    if (Array.isArray(item) && depth > 0) {
      newArr.push.apply(newArr, item.applyFlat(depth - 1))
    } else {
      newArr.push(item)
    }
  }

  return newArr
}

// flat方法(ES6)
Array.prototype.customFlat = function (depth = 1) {
  const newArr = []

  for (const item of this) {
    if (Array.isArray(item) && depth > 0) {
      newArr.push(...item.customFlat(depth - 1))
    } else {
      newArr.push(item)
    }
  }

  return newArr
}

Array.prototype.reduceFlat = function (depth = 1) {
  if (!depth) return this.slice()
  return this.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? cur.reduceFlat(depth - 1) : cur)
  }, [])
}

Array.prototype.stackFlat = function () {
  const stack = [...this]
  const newArr = []
  while (stack.length) {
    const next = stack.pop()
    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      newArr.push(next)
    }
  }
  return newArr.reverse()
}

const arr = [1, 2, 3, 4, 5, [6, 7, [8, 9]]]
console.log(arr.stackFlat())
