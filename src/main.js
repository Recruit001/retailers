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

// 导入使用ZKTable
import ZkTable from 'vue-table-with-tree-grid'

// 全局样式设置
import("./assets/css/global.css")

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

Vue.use(ElementUI);
// 富文本注册
Vue.use(VueQuillEditor)
// Vue.use(ZkTable)
// 注册为全局组件
Vue.component('ZkTable', ZkTable)
// 注册全局过滤器
Vue.filter('dataTransform',(data) => {
  const newData = new Date(data)
  const yy = newData.getFullYear()
  const mm = (newData.getMonth() + 1 + '').padStart(2,'0')
  const dd = (newData.getDay() + 1 + '').padStart(2,'0')
  const HH = (newData.getHours() + 1 + '').padStart(2,'0')
  const MM = (newData.getMinutes() + '').padStart(2,'0')
  const SS = (newData.getSeconds() + '').padStart(2,'0')
  return `${yy}-${mm}-${dd} ${HH}:${MM}:${SS}`
})

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
