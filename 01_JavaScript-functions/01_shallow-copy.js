function getObjectTypeStr(originValue) {
  return Object.prototype.toString.call(originValue)
}

function shallowCopy(originValue) {
  // null/undefined/原始类型/function
  if (
    originValue === null ||
    originValue === undefined ||
    typeof originValue !== 'object'
  ) {
    return originValue
  }

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
}
