function getShort(str) {
  let short = ''
  let strSplit = str.split(' ')

  for (let i = 0; i < strSplit.length; i++) {
    //add Lab in short name when necessary
    if (!strSplit[i][0].match(/^[^A-Z]*$/g))
      if (strSplit[i].includes('Lab'))
        short += ' Lab'
      else
        short += strSplit[i][0]
  }

  return short
}

module.exports = { getShort }