// 基于Promise封装xhr请求
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

request({
  url: 'http://abc',
  method: 'post',
  data: {
    name: 'Jack',
    age: 30
  }
})
