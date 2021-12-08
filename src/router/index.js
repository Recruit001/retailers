import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home/Home.vue'
import Welcome from '../views/Home/Welcome.vue'
import User from '../views/User/User.vue'
import Rights from '../views/Power/Rights.vue'
import Roles from '../views/Power/Roles.vue'
import Cate from '../views/Goods/Cate.vue'
import Params from '../views/Goods/Params.vue'
import List from '../views/Goods/List.vue'
import AddGoods from '../views/Goods/AddGoods/AddGoods.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    children:[
      {path:"",name:"Welcome",component: Welcome},
      {path:"/users",name:"users",component:User},
      {path:"/rights",name:"rights",component:Rights},
      {path:"/roles",name:"roles",component:Roles},
      {path:"/categories",name:'Cate',component:Cate},
      {path:"/params",name:'Params',component:Params},
      {path:"/goods",name:'List',component:List},
      {path:'/add',name:'AddGoods',component:AddGoods},
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
  if(to.path == '/') return next()
  if(window.sessionStorage.getItem('token')){
    next()
  }
  else{
    next('/')
  }
})

export default router
