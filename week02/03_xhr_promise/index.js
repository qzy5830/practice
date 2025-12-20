// 基于Promise封装xhr请求
function request(options) {
  let { url, method = 'get', responseType = 'json', data = {} } = options

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // 监听加载完成
    xhr.onload = function () {
      // 根据响应码判断
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject({ status: xhr.status, message: xhr.statusText })
      }
    }

    // 设置相应类型
    xhr.responseType = responseType

    // 判断请求方法
    if (method.toUpperCase() === 'GET') {
      // 判断url是否包含query
      if (Object.keys(data).length) {
        const queryString = []
        for (const key in data) {
          queryString.push(`${key}=${data[key]}`)
        }

        const jointSymbol = url.indexOf('?') !== -1 ? '&' : '?'
        url = `${url}${jointSymbol}${queryString.join('&')}`
      }

      xhr.open(method, url)
      xhr.send()
    } else {
      xhr.open(method, url)
      xhr.send(JSON.stringify(data))
    }
  })
}

request({
  url: 'http://abc?height=1.73',
  data: {
    name: 'Jack',
    age: 30
  }
})
