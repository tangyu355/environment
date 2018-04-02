import Vue from 'vue'
import url from 'url'

// Vue 及其插件
import Resource from 'vue-resource'
import Router from 'vue-router'
import routerObject from 'src/route'
// import echartbar from 'components/common/echartbar'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

// import VueAnimatedList from 'vue-animated-list'
// App
import config from 'src/config.json'
import App from './App'
import store from 'src/store'
import {initApi} from 'src/api'
import { Message } from 'element-ui';
import myPagination from 'components/common/myPagination'
import echartBar from 'components/common/echartBar'
import echartPie from 'components/common/echartPie'
import pieBar from 'components/common/pieBar'
import Iview from 'iview'
import 'iview/dist/styles/iview.css'

// import echarts from 'src/echarts'

// 加载插件
Vue.use(Resource)
Vue.use(Router)
Vue.use(ElementUI)
Vue.use(Iview)
console.log(Vue.http.options.emulateJSON)
Vue.http.options.emulateHTTP = true;
Vue.http.options.emulateJSON = true;
// Vue.component('echartbar', echartbar)
Vue.component('my-pagination', myPagination)
Vue.component('echart-bar', echartBar)
Vue.component('echart-pie', echartPie)
Vue.component('pie-bar', pieBar)
// 配置 vue-resource
// console.log(process.env)
if (process.env.NODE_ENV === 'production') {
  Vue.http.options.root = url.format(config.api)
} else {
  Vue.http.options.root = url.format(config.devapi)
}
// Vue.http.options.emulateJSON = true
// -1错误全部识别为未登录

Vue.http.interceptors.push({
  request: function (request) {
    // console.log(request)
    return request
  },
  response: function (response) {
   if (response.data.status === -1 && (response.request.url !== 'user/islogin') ) {
      console.log(response)
      Message.error('请登录！')
      setTimeout(function () {
        store.actions.notLogin()
        //location.reload()
      }, 500)
    }
    return response
  }
})

// 初始化 API
initApi()

// 初始化路由
let router = new Router(routerObject)
// 启动 App
const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

