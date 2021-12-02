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
      // add &
      else if (strSplit[i] == '&' || strSplit[i].toLowerCase() == 'and')
        short += '&'
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

function getBestAttempts(attempts) {
  let bestAttempts = []
  //get the first available attempt
  for (let i = 0; i < attempts.length; i++) {
    if (Object.keys(attempts[i]).length > 0) {
      bestAttempts = attempts[i].subjects
      break
    }
  }
  if (attempts[0].failedCount == 0) {
    console.log('returning since single attempt')
    return bestAttempts
  }
  for (let i = 1; i < attempts.length; i++) {
    //continue if empty obj {} found
    if (!!!Object.keys(attempts[i]).length) continue
    // console.log(attempts[i].subjects)
    // console.log(bestAttempts)
    for (let j = 0; j < attempts[i].subjects.length; j++) {
      for (let k = 0; k < bestAttempts.length; k++)
        if (attempts[i].subjects[j]['Subject Name'].toLowerCase() == bestAttempts[k]['Subject Name'].toLowerCase()) {
          bestAttempts[k] = attempts[i].subjects[j]
          // console.log(attempts[i].subjects[j], bestAttempts[k])
        }
    }
  }
  return bestAttempts
}
module.exports = { getShort, getBestAttempts } 