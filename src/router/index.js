import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home/Home.vue'
import Welcome from '../views/Home/Welcome.vue'
import User from '../views/User/User.vue'
import Rights from '../views/Power/Rights.vue'
import Roles from '../views/Power/Roles.vue'

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
      {path:"/roles",name:"roles",component:Roles}
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
