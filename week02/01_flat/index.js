// ES5
function customFlatES5(arr, depth) {
  depth = depth || 0
  var newArr = []

  for (var i = 0; i < arr.length; i++) {
    var current = arr[i]
    if (Array.isArray(current) && depth > 0) {
      newArr.push.apply(newArr, customFlatES5(current, depth - 1))
    } else {
      newArr.push(current)
    }
  }

  return newArr
}

// ES6
function customFlatES6(arr, depth = 0) {
  const newArr = []

  arr.some((item) => {
    if (Array.isArray(item) && depth > 0) {
      newArr.push(...customFlatES6(item, depth - 1))
    } else {
      newArr.push(item)
    }

    return false
  })

  return newArr
}

// reduce
function customFlat(arr, depth = 0) {
  return arr.reduce((prev, cur) => {
    if (Array.isArray(cur) && depth > 0) {
      return prev.concat(...customFlat(cur, depth - 1))
    } else {
      prev.push(cur)
      return prev
    }
  }, [])
}
console.log(customFlatES6(arr, Infinity))
