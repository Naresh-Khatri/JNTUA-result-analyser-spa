function getShort(str) {
  let short = ''
  let strSplit = str.split(' ')
  // console.log(strSplit)

  if (strSplit.length == 1)
    return strSplit[0]
  else {
    for (let i = 0; i < strSplit.length; i++) {
      // ignore 'I' and 'II'
      if (strSplit[i] == 'I' || strSplit[i] == 'II' || strSplit[i] == 'III')
        short += ''
      else {
        //get first uppercase letter then append to short
        if (!strSplit[i][0].match(/^[^A-Z]*$/g)) {
          //add Lab in short name when necessary
          if (strSplit[i].toLowerCase().includes('lab') && strSplit[i].length > 2)
            short += ' Lab'
          else
            short += strSplit[i][0]
        }
      }

    }
    // console.log(`${strSplit} -> ${short}`)

    return short
  }
}

module.exports = { getShort }