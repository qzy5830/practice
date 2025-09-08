# JavaScript数组扁平化flat方法

### 前言
在JavaScript中, 将一个多维数组即一层或多层嵌套的数组转换成一个一维数组即不存在数组嵌套的数组, 这个过程就称之为数组扁平化。

## Array.prototype.flat
flat方法是JavaScript中Array.prototype中的一个方法, 所有数组实例都可使用此方法, 用于将一个多维数组扁平化, 即把一个多层嵌套的数组转换为少于原来的嵌套或者不存在嵌套的一维数组。此方法实在ECMAScript2019(ES10)中引入的。flat方法接收一个可选的参数depth(数值), 即指定扁平化的深度。flat方法的返回值是一个新的数组。
 - 不传参时, depth默认值为1, 扁平化第一层条套的数组
 - 传入数值n表示将数组扁平化到底n层的深度
 - 传入Infinity, 则表示不管层级多深的嵌套都扁平化为一维数组

以下是flat方法使用示例
```javascript
const arr = [1, 2, 3, [4, 5, 6, [7, 8, 9, [10, 11]]]]
// 不传, 默认为1
console.log(arr.flat()) // [1, 2, 3, 4, 5, 6, [7, 8, 9, [10, 11]]]
// 扁平化到第2层
console.log(arr.flat(2)) // [1, 2, 3, 4, 5, 6, 7, 8, 9, [10, 11]]
// 扁平化成一维数组
console.log(arr.flat(Infinity)) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

## 自定义flat方法的实现
#### ES5实现(for循环 + apply)
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
基于ES5语法普通for循环 + apply方法实现, 支持可选深度参数扁平化控制, 不传深度参数的情况下默认为1。传入Infinity时, 可转为一维数组。使用ES5的语法实现, 代码兼容性及可读性较强, 用到了递归方式, 若数据量较大或层级较深时, 可能会造成栈溢出。

#### ES6实现(reduce版)
```javascript
Array.prototype._flat = function (depth = 1) {
  return this.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? cur._flat(depth - 1) : cur)
  }, [])
}
```
基于ES6+reduce实现的方式, 代码简洁, 兼容性比不上ES5的实现方式。同样使用了递归调用, 存在栈溢出的风险。


#### ES6实现
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
基于ES6, for...of + 展开运算符实现, 代码量比ES5的实现方式减少了一些但兼容性不如ES5的实现方式, 同样存在栈溢出风险。

#### stack栈实现
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
基于栈结构实现, 替代了递归的方式, 避免了栈溢出, 对比其他方式, 内部多使用了一块内存空间来保存原数组。

### 总结
以上是flat方法实现的几种方式, 每种方式都有各自的特点, 可根据实际情况或业务场景选择对应的方式。