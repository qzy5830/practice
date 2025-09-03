# JavaScript数组扁平化flat方法

### 前言
在JavaScript中, 将一个多维数组即一层或多层嵌套的数组转换成一个一维数组即不存在数组嵌套的数组, 这个过程就称之为数组扁平化。在ES6及之后, 可以通过数组原型中的flat方法来实现数组扁平化。

## Array.prototype.flat
flat方法是定义在Array构造函数的原型上的, 所以可以直接通数组实例调用, flat方法会返回一个新的数组, flat方法接收一个number类型的数值作为参数, 表示转换的层数, 默认值为1, 如果不管有多少层嵌套, 都要转成一维数组, 可以使用Infinity关键字作为参数
```javascript
const arr = [1, 2, 3, [4, 5, 6, [7, 8, 9, [10, 11]]]]
// 不传, 默认为1
console.log(arr.flat()) // [1, 2, 3, 4, 5, 6, [7, 8, 9, [10, 11]]]
console.log(arr.flat(2)) // [1, 2, 3, 4, 5, 6, 7, 8, 9, [10, 11]]
console.log(arr.flat(Infinity)) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

## flat方法的实现
- ES5实现
```javascript
Array.prototype._flat = function (depth) {
  depth = depth || 1
  var newArr = []
  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    if (Array.isArray(item) && depth > 0) {
      newArr.push.apply(newArr, item._flat(depth - 1))
    } else {
      newArr.push(item)
    }
  }
  return newArr
}
```

- ES6实现
```javascript
Array.prototype._flat = function (depth = 1) {
  const newArr = []
  for (const item of this) {
    if (Array.isArray(item) && depth > 0) {
      newArr.push(...item._flat(depth - 1))
    } else {
      newArr.push(item)
    }
  }
  return newArr
}
```

- ES6实现(reduce版)
```javascript
Array.prototype._flat = function (depth = 1) {
  return this.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? cur._flat(depth - 1) : cur)
  }, [])
}
```

- stack栈实现(完全扁平化)
```javascript
Array.prototype._flat = function () {
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
```

### 总结
以上是flat方法实现的几种方式, ES5实现方式通过for循环以及apply方法, ES6实现方式通过for...of以及展开运算符, reduce实现方式代码更简洁, stack实现方式则是先出栈再压栈, 最后通过reverse反转得到结果。flat方法也是一个数组浅拷贝方法, 内层如果是引用类型数据, 那么会共用同一个内存地址, 修改其中一个会影响另外一个。