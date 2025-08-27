# JavaScript instanceof关键字详解

### 前言
在JavaScript中, instanceof关键字是一个操作符, 返回值为boolean。用于判断一个实例对象是否是某个构造函数创建出来的实例, 或者说实例对象是什么类型的实例对象。更具体一点就是检测构造函数的原型对象(构造函数的prototype属性指向的对象)是否在实例对象的原型链上。

## JavaScript中的原型(Prototype)与原型链(Prototype Chain)
我们先来了解一下JavaScript中的原型与原型链。首先, 每个JavaScript对象都有一个隐式原型([[Prototype]]), 可通过__proto__(非标准)或Object.getPrototype(obj)访问。而每个函数(构造函数)对象都具有一个显式原型, 可通过prototype属性访问, 用于定义实例共享的属性和方法。当访问一个对象的属性时, 首先会查找对象自身是有该属性, 如果找到则直接返回该属性值, 如果没有, 那么会查找对象的原型中是否有该属性, 如果找到则直接返回, 如果没有, 那么会继续查找原型的原型, 以此类推, 直到查找到Object.prototype, 此查找过程就形成以一个链条, 这个链条就成为原型链。而原型链的顶端就是Object.prototype, 如果查找到顶端还是没有, 那么就返回undefined。

## instanceof的用法
````javascript
const obj = {
  name: 'Jack'
}

const foo = function() => {}

console.log(obj instanceof Object) // true
console.log(foo instanceof Function) // true
console.log(foo instanceof Object) // false
````

### instanceof实现原理
```javascript
// 定义_instanceof方法, 接收实例对象和构造函数两个参数
function _instanceof(instance, constructor) {
  // 获取实例的原型对象
  let prototype = Object.getPrototypeOf(instance)

  // 遍历instance的整个原型链
  while(prototype) {
    // 若找到原型对象直接返回true
    if (prototype === constructor.prototype) return true
    // 否则继续获取原型对象的原型对象, 向上查找
    prototype = Object.getPrototypeOf(prototype)
  }

  // 直到查找完整个原型链都没有匹配到, 返回false 
  return false
}
```

### 总结
instanceof操作符用于检测引用类型, 其查找规则就是遍历操作符左边实例对象的整个原型链, 获取到实例的原型对象与右边构造函数的原型对象做匹配, 如果匹配到了那么就返回true, 否则就会获取实例的原型对象的原型对象, 继续沿着原型链向上查找, 直到遍历完整个原型链如果都没有匹配到构造函数的原型对象, 那么返回false。
