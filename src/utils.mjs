import axios from 'axios'
import $JSSoup from 'jssoup'
const JSSoup = $JSSoup.default

export class Result {
  constructor(htn, resultId) {
    this.url = 'https://jntuaresults.ac.in/view-results-56736424.html'
    this.htn = htn,
      this.resultId = resultId
  }
  getToken() {
    return new Promise((resolve, reject) => {
      axios.get(this.url)
        .then((res) => {
          const pageHTML = res.data
          const token = this.parseInt(pageHTML.substring(
            pageHTML.indexOf('access'), pageHTML.indexOf('access') + 30
          ))
          resolve(token)
        })
        .catch(err => reject(err))

    })
  }
  parseInt(str) {
    let num = ''
    for (let i = 0; i < str.length; i++) {
      num += Number.parseInt(str[i]) || str[i] == '0' ?
        Number.parseInt(str[i]) : ''
    }
    return num
  }
  async getResult() {
    // const token = await this.getToken()
    var config = {
      method: 'get',
      url: `https://jntuaresults.ac.in/results/res.php?ht=${this.htn}&id=${this.resultId}&accessToken=${8391830}`,
      headers: {
        'Cookie': 'PHPSESSID=kk98b6kd3oaft9p9p8uiis6ae6;',
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Vary": "Origin",
        "Host": "jntuaresults.ac.in",
        "Connection": "keep - alive",
        "User-Agent": "Mozilla / 5.0(Linux; Android 8.0.0; Pixel 2 XL Build / OPD1.170816.004) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 91.0.4472.77 Mobile Safari / 537.36",
        "Accept": "*/*",
        "Sec-GPC": "1",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://jntuaresults.ac.in/view-results-56736424.html",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
      },
    };
    console.log(config.url)
    axios(config)
      .then(res => {
        const table = document.createElement('table')
        table.innerHTML = res.data
        console.log(table)
      })
  }
  test() {
    return 'ok'
  }
}

// const main = async () => {
//   let res = new Result('19fh1a0546', '56736424')
//   res.getResult()
//   //console.log(await res.getToken())
// }

// main()
