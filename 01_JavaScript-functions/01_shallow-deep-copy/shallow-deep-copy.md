# JavaScript浅拷贝与深拷贝

### 前言
在JavaScript中, 浅拷贝 (Shallow Copy) 和深拷贝 (Deep Copy) 是处理对象复制的两种核心方式, 主要作用是控制复制后新对象与原对象之间的关联关系据。它们的核心区别在于对引用类型属性的处理方式, 这也决定了它们的应用场景和价值。

## 浅拷贝的实现方式及应用  
浅拷贝的核心是仅复制对象的第一层属性。如果属性是基本数据类型 (number、string、boolean), 会直接复制。如果是引用类型(Object、Array、Function), 则复其内存地址 (引用), 而非之际内容。因此, 浅拷贝后的新对象与原对象会共享内部引用类型属性的底层数据

 - Object.assign

```javascript
const obj = {
  name: 'Jack',
  friend: {
    name: 'Peter'
  }
}

// newObj为obj浅拷贝后的对象, 引用类型属性共享一块内存空间
const newObj = Object.assign({}, obj)
```

 - 展开运算符(...) 

```javascript
const obj = {
  name: 'Jack',
  friend: {
    name: 'Peter'
  }
}

// 展开运算符, 解构obj对象, 获得第一层的每一个属性和属性值
const newObj = {
  ...obj
}

// 数组的浅拷贝
const arr1 = [{ name: 'a' }, { name: 'b' }, { name: 'c' }]
// arr2中的元素(引用类型)和arr1中的元素(引用类型)为同一个对象
const arr2 = [...arr1]
```

- 自定义浅拷贝方法shallowCopy的实现
```javascript
function shallowCopy(originValue) {
  // null/undefined/原始类型/function类型
  if (originValue === null || originValue === undefined || typeof originValue !== 'object') {
    return originValue
  }

  let newValue = null

  // 数组
  if (originValue.constructor === Array) {
    return [...originValue]
  }

  // 对象
  if (originValue.constructor === Object) {
    return {
      ...originValue
    }
  }

  return newValue
}
```

## 深拷贝的实现方式及应用
深拷贝的核心是递归复制对象的所有层级属性, 直到所有引用类型都被独立复制为一份全新的内存数据。最终新对象与原对象完全隔离, 修改新对象的任何属性 (包括深层嵌套的属性) 都不会影响原对象。

- JSON序列化实现深拷贝
```javascript
const obj = {
  name: 'Jack',
  age: 30,
  friend: {
    name: 'Peter'
  }
}

const copyObj = JSON.parse(JSON.stringify(obj))
```

- JSON序列化存在的问题
```javascript
// 1.无法处理特殊类型
// function => 丢失
// undefined => 丢失
// symbol => 丢失

// 循环引用会报错
const obj = {
  name: 'Jack'
}

obj.self = obj
// 报错
const newObj = JSON.parse(JSON.stringify(obj))
```

- 自定义深拷贝方法deepCopy实现
```javascript
function deepCopy(originValue, wm = new WeakMap()) {
  // Set
  if (originValue.constructor === Set) {
    const set = new Set()
    for (const setItem of originValue) {
      set.add(deepCopy(setItem, wm))
    }
    return set
  }

  // Map
  if (originValue.constructor === Map) {
    const map = new Map()
    for (const [mapKey, mapValue] of originValue) {
      map.set(deepCopy(mapKey, wm), deepCopy(mapValue, wm))
    }
    return map
  }

  // Date
  if (originValue.constructor === Date) {
    return new Date(originValue.getTime())
  }

  // RegExp
  if (originValue.constructor === RegExp) {
    const regExp = new RegExp(originValue.source, originValue.flags)
    regExp.lastIndex = originValue.lastIndex
    return regExp
  }

  // Symbol值
  if (typeof originValue === 'symbol') {
    return Symbol(originValue.description)
  }

  // null/undefined/function/原始类型
  if (
    originValue === null ||
    originValue === undefined ||
    typeof originValue !== 'object'
  ) {
    return originValue
  }

  // 是否保存过原始对象(解决循环引用)
  if (wm.get(originValue)) {
    return wm.get(originValue)
  }

  // 对象/数组
  const newValue = Array.isArray(originValue) ? [] : {}

  // 保存原始对象(循环引用)
  wm.set(originValue, newValue)

  // 遍历实例属性
  for (const key in originValue) {
    if (originValue.hasOwnProperty(key)) {
      newValue[key] = deepCopy(originValue[key], wm)
    }
  }

  // 遍历SymbolKeys
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const symbolKey of symbolKeys) {
    newValue[Symbol(symbolKey.description)] = deepCopy(originValue[symbolKey], wm)
  }

  return newValue
}
```

### 总结
浅拷贝和深拷贝的选择, 取决于具体的应用场景。如果只是简单的结构或者只需要复制第一层结构时, 那么浅拷贝提供了简洁高效的方案。如果是较为复杂的结构, 特别是内层属性包含了引用类型或多层嵌套以及特殊的类型时, 深拷贝能够确保内层数据的独立性和完整性。在实际开发中可以根据实际的需求, 权衡拷贝的深度与性能开销来选择适合的拷贝方式。
