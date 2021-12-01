import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { getApi,postApi,putApi,deleteApi } from '@/tools/request.js'

// 安装element-ui组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入 iconfont 样式
import("./assets/fonts/iconfont.css")

// 全局样式设置
import("./assets/css/global.css")


Vue.config.productionTip = false

Vue.use(ElementUI);

// 注册全局请求函数
Vue.prototype.$getApi = getApi
Vue.prototype.$postApi = postApi
Vue.prototype.$putApi = putApi
Vue.prototype.$deleteApi = deleteApi

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
