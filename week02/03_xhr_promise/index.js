// 基于Promise封装xhr请求

function request() {
  const xhr = new XMLHttpRequest()

  xhr.onload = function () {
    console.log(xhr.response)
  }

  xhr.responseType = 'json'

  // get
  // xhr.open('get', 'http://123.207.32.32:1888/02_param/get?name=why')
  // xhr.send()

  // post(urlencoded)
  // xhr.open('post', 'http://123.207.32.32:1888/02_param/posturl')
  // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  // xhr.send('name=Peter&age=30')

  // post(FormData)
  // xhr.open('post', 'http://123.207.32.32:1888/02_param/postform')
  // const formData = new FormData()
  // formData.append('name', 'Peter')
  // formData.append('age', 30)
  // xhr.send(formData)

  // post(json)
  xhr.open('post', 'http://123.207.32.32:1888/02_param/postjson')
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.send(JSON.stringify({ name: 'Jack', age: 30 }))
}

request()
