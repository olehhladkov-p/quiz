export const snakeToCamelCase = str =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, group =>
      group.toUpperCase().replace('-', '').replace('_', '')
    )

const urlParamsRegexp = /\{(.*?)\}/g // example => {CATEGORY_ID}

export const replaceUrlParams = (url, paramsSource) =>
  url.replace(urlParamsRegexp, (_, match) =>
    paramsSource[snakeToCamelCase(match.toLowerCase())].toString().toLowerCase()
  )
