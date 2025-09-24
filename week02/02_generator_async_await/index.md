# 基于Generator实现async/await

### 前言
Generator(生成器)函数是ES2015引入的一种异步编程解决方案, Generator函数返回一个迭代器对象, 通过调用迭代器对象的next方法来来执行Generator函数内部的代码, 而函数体内部我们可以通过yield关键字来控制代码的执行。async/await则是ES2017引入的特性, 实际上就是Generator函数的语法糖。

## async/await异步方案
```javascript
// 模拟异步请求的方法
function requestData(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(url)
    }, 1000)
  })
}

// 定义异步函数
async function getData() {
  // await关键字后面的表达式的返回值一般是一个Promise
  // 等到await后面的Promise有了结果, 才会执行后面的代码
  // 相当于就是前一个请求有了结果才会执行下一个请求
  const res1 = await requestData('/api')
  const res2 = await requestData(`${res1}/abc`)
  const res3 = await requestData(`${res2}/cba`)
  console.log(res) // '/api/abc/cba'
}

getData()
```

## Generator实现async/await
```javascript
function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url)
    }, 500)
  })
}

function* getData() {
  const res1 = yield requestData('/api')
  const res2 = yield requestData(`${res1}/abc`)
  const res3 = yield requestData(`${res2}/cba`)
  console.log(res3)
}

// 手动执行生成器函数
const generator = getData()
generator.next().value.then((res) => {
  console.log(res)
  generator.next(res).value.then((res1) => {
    console.log(res1)
    generator.next(res1).value.then((res2) => {
      console.log(res2)
    })
  })
})

// 自动执行生成器函数
function execGenerator(genFn) {
  const generator = genFn()
  function exec(result) {
    if (result.done) return
    if (result.value instanceof Promise) {
      result.value
        .then((res) => exec(generator.next(res)))
        .catch((err) => generator.throw(err))
    } else {
      exec(generator.next(result.value))
    }
  }

  try {
    exec(generator.next())
  } catch (err) {
    generator.throw(err)
  }
}

execGenerator(getData)
```

### 总结
Generator函数通过yield关键字可以实现多个异步请求同步一个一个的执行, 而asycn/await就是Generator函数的语法糖。