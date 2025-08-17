### JavaScript浅拷贝 :
在JavaScript中, 浅拷贝就是创建一个新的对象, 然后将原对象的属性值复制到新的对象中。如果属性值是原始数据类型, 那么新对象和原对象各自拥有独立的值, 修改其中一个对象的属性值, 不会影响另一个对象对应的属性值。如果属性值是引用类型(比如对象、数组等), 那么拷贝的只是引用地址, 两个引用类型的属性会共享同一块内存空间, 修改其中一个会影响另外一个。这就是浅拷贝, 对于新对象和原对象, 是两个完全独立的对象, 但是对于内层的引用类型属性, 指向的仍然是同一个对象, 共享同一块内存空间。   

### 浅拷贝的实现方式及应用     
 - Object.assign : 合并一个或多个对象

```javascript
const obj = {
  name: 'Jack',
  friend: {
    name: 'Peter'
  }
}

// newObj为obj的浅拷贝后的对象, 引用类型属性共享一块内存空间
const newObj = Object.assign({}, obj)
```

 - 展开运算符(...) : 

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

### 浅拷贝的自定义方法实现(只处理普通对象{}和数组[]) 
定义一个判断是普通对象和数组的方法, 该方法通过call调用Object原型对象的toString方法得到一个'[object Constructor(构造函数)]'形式的字符串  

```javascript
function getObjectTypeStr(originValue) {
  return Object.prototype.toString.call(originValue)
}
```  

定义shallowCopy具体的浅拷贝实现方法
     
```javascript  
function shallowCopy(originValue) {}
```   

方法内部首先判断传入的originValue是否为null/undefined/其他原始类型/function类型, 如果是这些类型那么直接返回

```javascript
if (originValue === null || originValue === undefined || typeof originValue !== 'object') {
  return originValue
}
```   

接着定义一个newValue变量初始值为null, 通过之前定义的getObjectTypeStr方法判断传入的值为普通对象还是数组, 如果为数组, 那么直接通展开运算符[...originValue]得到一个新的数组(第一层)赋值给newValue。如果为普通对象, 也通过展开运算符{...originValue}(第一层)赋值给newValue, 最后将newValue作为返回值返回

```javascript
let newValue = null   

// 数组   
if (getObjectTypeStr(originValue) === '[object Array]') {
  newValue = [...originValue]
}   

// 对象
if (getObjectTypeStr(originValue) === '[object Object]') {
  newValue = {
    ...originValue
  }
}

return newValue
```  

shallowCopy浅拷贝方法完整的实现

```javascript
function shallowCopy(originValue) {
  // null/undefined/原始类型/function类型
  if (originValue === null || originValue === undefined || typeof originValue !== 'object') {
    return originValue
  }

  let newValue = null

  // 数组
  if (getObjectTypeStr(originValue) === '[object Array]') {
    return [...originValue]
  }

  // 对象
  if (getObjectTypeStr(originValue) === '[object Object]') {
    return {
      ...originValue
    }
  }

  return newValue
}
```

### 浅拷贝的优点
 - 性能高效, 实现方式简单便捷
 - 当需要共享底层数据时, 可以保留引用关系, 很有价值
 - 避免不必要的大数据复制

### 浅拷贝的缺点
 - 嵌套引用类型数据会造成污染, 修改会双向影响
 - 不适用于深隔离场景
 - 浅拷贝仅复制自身可枚举的属性
