/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/



import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

import '@quasar/extras/roboto-font/roboto-font.css'

import '@quasar/extras/material-icons/material-icons.css'



import '@quasar/extras/animate/fadeIn.css'

import '@quasar/extras/animate/fadeOut.css'

import '@quasar/extras/animate/tada.css'

import '@quasar/extras/animate/bounceIn.css'

import '@quasar/extras/animate/bounceOut.css'

import '@quasar/extras/animate/rotateOut.css'

import '@quasar/extras/animate/rotateIn.css'

import '@quasar/extras/animate/jackInTheBox.css'

import '@quasar/extras/animate/hinge.css'


// We load Quasar stylesheet file
import 'quasar/dist/quasar.sass'




import 'src/css/app.scss'


import Vue from 'vue'
import createApp from './app.js'




import qboot_BootgmtPlugin from 'boot/gmtPlugin'

import qboot_Bootaxios from 'boot/axios'

import qboot_Bootcharts from 'boot/charts'







Vue.config.devtools = true
Vue.config.productionTip = false



console.info('[Quasar] Running SPA.')





const publicPath = ``


async function start () {
  const { app, store, router } = await createApp()

  

  
  let hasRedirected = false
  const redirect = url => {
    hasRedirected = true
    const normalized = Object(url) === url
      ? router.resolve(url).route.fullPath
      : url

    window.location.href = normalized
  }

  const urlPath = window.location.href.replace(window.location.origin, '')
  const bootFiles = [qboot_BootgmtPlugin,qboot_Bootaxios,qboot_Bootcharts]

  for (let i = 0; hasRedirected === false && i < bootFiles.length; i++) {
    if (typeof bootFiles[i] !== 'function') {
      continue
    }

    try {
      await bootFiles[i]({
        app,
        router,
        store,
        Vue,
        ssrContext: null,
        redirect,
        urlPath,
        publicPath
      })
    }
    catch (err) {
      if (err && err.url) {
        window.location.href = err.url
        return
      }

      console.error('[Quasar] boot error:', err)
      return
    }
  }

  if (hasRedirected === true) {
    return
  }
  

  

    

    

    
      new Vue(app)
    

    

    

  

}

start()
