### JavaScript浅拷贝:
对象的浅拷贝是属性与拷贝源对象属性共享相同的引用(指向相同的底层值)的副本。因此，当你更改源对象或副本时，也可能导致应一个对象发生更改。    

如果两个对象o1和o2是浅拷贝那么 :    

 - 它们不是同一个对象(o1 !== o2)   
 - o1和o2具有相同的属性名和属性值且顺序相同    
 - 它们的原型链相等    

对于浅拷贝，只拷贝对象或数组的第一层内容，不处理嵌套对象或数组的深层拷贝。因此 :      

 - 修改副本的第一层属性不会影响源对象  
 - 修改副本的嵌套对象属性会影响源对象    


### 浅拷贝的简单实现(只处理普通对象{}和数组[]) :    
定义一个判断是普通对象和数组的方法，该方法通过call调用Object原型对象的toString方法得到一个'[object Constructor(构造函数)]'形式的字符串 :    

```javascript
function getObjectTypeStr(originValue) {
  return Object.prototype.toString.call(originValue)
}
```  

定义shallowCopy具体的浅拷贝实现方法 : 
     
```javascript  
function shallowCopy(originValue) {}
```   

方法内部首先判断传入的originValue是否为null/undefined/其他原始类型/function类型，如果是这些类型那么直接返回 : 

```javascript
if (originValue === null || originValue === undefined || typeof originValue !== 'object') {
  return originValue
}
```   

接着定义一个newValue变量初始值为null，通过之前定义的getObjectTypeStr方法判断传入的值为普通对象还是数组，如果为数组，那么直接通展开运算符[...originValue]得到一个新的数组(第一层)赋值给newValue。如果为普通对象，也通过展开运算符{...originValue}(第一层)赋值给newValue，最后将newValue作为返回值返回 : 

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

shallowCopy浅拷贝方法完整的实现 : 

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

