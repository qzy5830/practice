# 基于 Promise 封装 xhr 请求

### 前言

在 Web 开发中, Ajax 请求已成为前端应用不可或缺的核心功能。传统的 XMLHttpRequest (XHR) API 虽然功能强大，但其基于回调的设计模式在现代异步编程中已显得捉襟见肘。回调地狱、错误处理困难、代码可读性差等问题长期困扰着开发者。随着 ECMAScript 6 标准的推出，Promise 为 JavaScript 的异步编程带来了革命性的变化。Promise 提供了一种更优雅、更可预测的异步处理方式，使代码结构更加清晰，错误处理更加统一。

## 基于 Promise 的 xhr 请求基本实现

```javascript
function request(options) {
  // 默认配置
  const config = {
    method: 'GET',
    url: '',
    data: null,
    timeout: 5000,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // 合并传入的配置
  Object.assign(config, options)

  // 请求方法统一转为大写
  config.method = config.method.toUpperCase()

  // 基于Promise实现请求过程
  return new Promise((resolve, reject) => {
    let { method, url, data, timeout, headers, responseType } = config

    // 创建xhr实例
    const xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP')

    // 设置响应类型
    xhr.responseType = responseType

    // 处理GET请求参数拼接
    if (method === 'GET' && data) {
      const params = new URLSearchParams()

      for (const key in data) {
        params.append(key, data[key])
      }

      const queryString = params.toString()

      // 拼接url, 判断原有的url是否包含?
      url += queryString
        ? url.includes('?')
          ? `&${queryString}`
          : `?${queryString}`
        : ''
    }

    // 处理POST请求
    if (method !== 'GET' && data) {
      // 根据Content-Type处理请求体
      const contentType = headers['Content-Type']

      if (contentType.includes('application/json')) {
        data = JSON.stringify(data)
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams()
        for (const key in data) {
          params.append(key, data[key])
        }
        data = params.toString()
      }
    }

    // 配置请求
    xhr.open(method, url)

    // 设置超时时间
    xhr.timeout = timeout

    const timerSecs = timeout + 100

    // 设置定时器(超时双重保护)
    const timeoutTimer = setTimeout(() => {
      // 中断请求
      xhr.abort()

      reject(new Error(`请求超时: ${timeout}ms`))
    }, timerSecs)

    // 监听加载完成
    xhr.onload = function () {
      // 判断http状态码
      if (xhr.saus >= 200 && xhr.status < 300) {
        resolve({
          status: xhr.status,
          message: xhr.statusText,
          data: xhr.response
        })
      } else {
        reject(new Error(`请求失败: ${xhr.status} ${xhr.statusText}`))
      }
    }

    // 监听请求超时
    xhr.ontimeout = function () {
      clearTimeout(timeoutTimer)
      xhr.abort()
      reject(new Error(`请求超时: ${timeout}ms`))
    }

    // 监听网络错误
    xhr.onerror = function () {
      clearTimeout(timeoutTimer)
      reject(new Error('网络错误'))
    }

    // 设置请求头
    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }

    // 发送请求
    xhr.send(data)
  })
}
```

### 总结

以上就是实现了一个基于 Promise 封装 XHR 的基本解决方案。这个方案不仅解决了传统 XHR 回调地狱的问题,核心优势基于现代化异步处理,使用 Promise 并支持 async/await。结合原生 xhr 的 timeout 请求超时监听以及 JavaScript 定时器,通过双重超时保护机制增强了请求的可靠性。
