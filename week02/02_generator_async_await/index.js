// 异步请求
function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url)
    }, 500)
  })
}

// 方案一: 多次回调
// requestData('/api').then((res1) => {
//   console.log(res1)
//   requestData(`${res1}/abc`).then((res2) => {
//     console.log(res2)
//     requestData(`${res1}/cba`).then((res3) => {
//       console.log(res3)
//     })
//   })
// })

// 方案二: Promise中then的返回值
// requestData('/api')
//   .then((res) => {
//     console.log(res)
//     return requestData(`${res}/abc`)
//   })
//   .then((res) => {
//     console.log(res)
//     return requestData(`${res}/cba`)
//   })
//   .then((res) => {
//     console.log(res)
//   })

// 方案三: Promise + Generator
function* getData() {
  const res1 = yield requestData('/api')
  const res2 = yield requestData(`${res1}/nba`)
  const res3 = yield requestData(`${res2}/cba`)
  console.log(res3)
}

// 手动执行生成器函数
// const generator = getData()
// generator.next().value.then((res) => {
//   console.log(res)
//   generator.next(res).value.then((res1) => {
//     console.log(res1)
//     generator.next(res1).value.then((res2) => {
//       console.log(res2)
//     })
//   })
// })

// 自动执行生成器函数
// function execGenerator(genFn) {
//   const generator = genFn()

//   function exec(res) {
//     const result = generator.next(res)
//     if (result.done) return result.value

//     result.value.then((re) => {
//       exec(re)
//     })
//   }

//   exec()
// }
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
