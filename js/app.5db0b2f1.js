(()=>{var e={7244:(e,t,r)=>{"use strict";r(5363),r(71);var n=r(8880),o=r(9592),a=r(3673);function s(e,t){const r=(0,a.up)("router-view");return(0,a.wg)(),(0,a.j4)(r)}var l=r(4260);const i={},c=(0,l.Z)(i,[["render",s]]),u=c;var d=r(4584),p=r(9582);const f=[{path:"/",component:()=>Promise.all([r.e(736),r.e(820)]).then(r.bind(r,3820)),children:[{path:"",component:()=>Promise.all([r.e(736),r.e(64),r.e(342)]).then(r.bind(r,153))},{path:"/single-result",component:()=>Promise.all([r.e(736),r.e(64),r.e(342)]).then(r.bind(r,153))},{path:"/personal-perf",component:()=>Promise.all([r.e(736),r.e(64),r.e(201)]).then(r.bind(r,5126))},{path:"/compare-result",component:()=>Promise.all([r.e(736),r.e(64),r.e(73)]).then(r.bind(r,9041))},{path:"/feedback",component:()=>Promise.all([r.e(736),r.e(508)]).then(r.bind(r,6508))},{path:"/batch-result",component:()=>Promise.all([r.e(736),r.e(64),r.e(670)]).then(r.bind(r,6199))},{path:"/stats",component:()=>Promise.all([r.e(736),r.e(64),r.e(503)]).then(r.bind(r,8503))},{path:"/percentage-calculator",component:()=>Promise.all([r.e(736),r.e(225)]).then(r.bind(r,8225))},{path:"/test",component:()=>Promise.all([r.e(736),r.e(112)]).then(r.bind(r,3112))}]},{path:"/:catchAll(.*)*",component:()=>Promise.all([r.e(736),r.e(118)]).then(r.bind(r,8118))}],h=f;function b(){const e=p.r5,t=(0,p.p7)({scrollBehavior:()=>({left:0,top:0}),routes:h,history:e("")});return t}async function m(e,t){const n="function"===typeof d["default"]?await(0,d["default"])({}):d["default"],{storeKey:a}=await Promise.resolve().then(r.bind(r,4584)),s="function"===typeof b?await b({store:n}):b;n.$router=s;const l=e(u);return l.use(o.Z,t),{app:l,store:n,storeKey:a,router:s}}var v=r(6249),g=r(921),y=r(6395),w=r(499),P=r(1039),k=r(4434);const j={config:{loadingBar:{}},plugins:{Loading:v.Z,LoadingBar:g.Z,LocalStorage:y.Z,Dialog:w.Z,AddressbarColor:P.Z,Notify:k.Z}},O="";async function C({app:e,router:t,store:r,storeKey:n},o){let a=!1;const s=e=>{try{return t.resolve(e).href}catch(r){}return Object(e)===e?null:e},l=e=>{if(a=!0,"string"===typeof e&&/^https?:\/\//.test(e))return void(window.location.href=e);const t=s(e);null!==t&&(window.location.href=t,window.location.reload())},i=window.location.href.replace(window.location.origin,"");for(let u=0;!1===a&&u<o.length;u++)try{await o[u]({app:e,router:t,store:r,ssrContext:null,redirect:l,urlPath:i,publicPath:O})}catch(c){return c&&c.url?void l(c.url):void console.error("[Quasar] boot error:",c)}!0!==a&&(e.use(t),e.use(r,n),e.mount("#q-app"))}m(n.ri,j).then((e=>Promise.all([Promise.resolve().then(r.bind(r,5474)),Promise.resolve().then(r.bind(r,7469))]).then((t=>{const r=t.map((e=>e.default)).filter((e=>"function"===typeof e));C(e,r)}))))},5636:e=>{let t="https://jntua.panipuri.tech/";console.log(window.location.href),e.exports={stats:t+"stats/public",releasedResults:t+"releasedResults",resIDDetails:t+"resultIDDetails",singleResult:t+"singleResult",singleResultv2:t+"singleResult/v2",batchResults:t+"batchResults",batchResultsv2:t+"batchResults/v2",feedback:t+"feedback",share:t+"share"}},5474:(e,t,r)=>{"use strict";r.r(t),r.d(t,{api:()=>l,default:()=>i});var n=r(7083),o=r(52),a=r.n(o),s=r(5636);const l=a().create({baseURL:s.prefix}),i=(0,n.xr)((({app:e})=>{e.config.globalProperties.$axios=a(),e.config.globalProperties.$api=l}))},7469:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(7083),o=r(3640);const a=(0,n.xr)((async({app:e})=>{e.use(o.ZP,{config:{id:"G-JFRDS4PHNE"}})}))},4584:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(7083),o=r(3617);r(52),r(5474);const a=(0,n.h)((function(){const e=(0,o.MT)({state(){return{}},mutations:{},actions:{},modules:{},strict:!1});return e}))}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,r),a.exports}r.m=e,(()=>{var e=[];r.O=(t,n,o,a)=>{if(!n){var s=1/0;for(u=0;u<e.length;u++){for(var[n,o,a]=e[u],l=!0,i=0;i<n.length;i++)(!1&a||s>=a)&&Object.keys(r.O).every((e=>r.O[e](n[i])))?n.splice(i--,1):(l=!1,a<s&&(s=a));if(l){e.splice(u--,1);var c=o();void 0!==c&&(t=c)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,o,a]}})(),(()=>{r.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;return r.d(t,{a:t}),t}})(),(()=>{r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}})(),(()=>{r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce(((t,n)=>(r.f[n](e,t),t)),[]))})(),(()=>{r.u=e=>"js/"+(64===e?"chunk-common":e)+"."+{64:"1b4cdfdb",73:"cbd1a52b",112:"adf5a639",118:"1de2b2d1",201:"fe7e9043",225:"15c7e8fa",342:"cedb6edf",503:"50fcf3ad",508:"2e758464",670:"0ac2d98b",820:"cbf641c3"}[e]+".js"})(),(()=>{r.miniCssF=e=>"css/"+({143:"app",736:"vendor"}[e]||e)+"."+{73:"c6858806",143:"31d6cfe0",201:"851b3384",225:"aef1ea60",342:"e6105801",503:"a3975e7d",508:"0a3175b0",670:"e558ec13",736:"ed928185",820:"c06c4c3e"}[e]+".css"})(),(()=>{r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{var e={},t="jntua_aesult_analyser:";r.l=(n,o,a,s)=>{if(e[n])e[n].push(o);else{var l,i;if(void 0!==a)for(var c=document.getElementsByTagName("script"),u=0;u<c.length;u++){var d=c[u];if(d.getAttribute("src")==n||d.getAttribute("data-webpack")==t+a){l=d;break}}l||(i=!0,l=document.createElement("script"),l.charset="utf-8",l.timeout=120,r.nc&&l.setAttribute("nonce",r.nc),l.setAttribute("data-webpack",t+a),l.src=n),e[n]=[o];var p=(t,r)=>{l.onerror=l.onload=null,clearTimeout(f);var o=e[n];if(delete e[n],l.parentNode&&l.parentNode.removeChild(l),o&&o.forEach((e=>e(r))),t)return t(r)},f=setTimeout(p.bind(null,void 0,{type:"timeout",target:l}),12e4);l.onerror=p.bind(null,l.onerror),l.onload=p.bind(null,l.onload),i&&document.head.appendChild(l)}}})(),(()=>{r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}})(),(()=>{r.p=""})(),(()=>{var e=(e,t,r,n)=>{var o=document.createElement("link");o.rel="stylesheet",o.type="text/css";var a=a=>{if(o.onerror=o.onload=null,"load"===a.type)r();else{var s=a&&("load"===a.type?"missing":a.type),l=a&&a.target&&a.target.href||t,i=new Error("Loading CSS chunk "+e+" failed.\n("+l+")");i.code="CSS_CHUNK_LOAD_FAILED",i.type=s,i.request=l,o.parentNode.removeChild(o),n(i)}};return o.onerror=o.onload=a,o.href=t,document.head.appendChild(o),o},t=(e,t)=>{for(var r=document.getElementsByTagName("link"),n=0;n<r.length;n++){var o=r[n],a=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(a===e||a===t))return o}var s=document.getElementsByTagName("style");for(n=0;n<s.length;n++){o=s[n],a=o.getAttribute("data-href");if(a===e||a===t)return o}},n=n=>new Promise(((o,a)=>{var s=r.miniCssF(n),l=r.p+s;if(t(s,l))return o();e(n,l,o,a)})),o={143:0};r.f.miniCss=(e,t)=>{var r={73:1,201:1,225:1,342:1,503:1,508:1,670:1,820:1};o[e]?t.push(o[e]):0!==o[e]&&r[e]&&t.push(o[e]=n(e).then((()=>{o[e]=0}),(t=>{throw delete o[e],t})))}})(),(()=>{var e={143:0};r.f.j=(t,n)=>{var o=r.o(e,t)?e[t]:void 0;if(0!==o)if(o)n.push(o[2]);else{var a=new Promise(((r,n)=>o=e[t]=[r,n]));n.push(o[2]=a);var s=r.p+r.u(t),l=new Error,i=n=>{if(r.o(e,t)&&(o=e[t],0!==o&&(e[t]=void 0),o)){var a=n&&("load"===n.type?"missing":n.type),s=n&&n.target&&n.target.src;l.message="Loading chunk "+t+" failed.\n("+a+": "+s+")",l.name="ChunkLoadError",l.type=a,l.request=s,o[1](l)}};r.l(s,i,"chunk-"+t,t)}},r.O.j=t=>0===e[t];var t=(t,n)=>{var o,a,[s,l,i]=n,c=0;if(s.some((t=>0!==e[t]))){for(o in l)r.o(l,o)&&(r.m[o]=l[o]);if(i)var u=i(r)}for(t&&t(n);c<s.length;c++)a=s[c],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(u)},n=self["webpackChunkjntua_aesult_analyser"]=self["webpackChunkjntua_aesult_analyser"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var n=r.O(void 0,[736],(()=>r(7244)));n=r.O(n)})();