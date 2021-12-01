import axios from 'axios'
import { Message,Loading } from 'element-ui';
import router from '../router/index.js'
// 创建拦截器
// 拦截器分为两种 一种为请求拦截器 一种为响应拦截器
// 响应拦截器

// 加一个请求验证 将登录成功后的token通过headers携带到服务器中

// 配置默认请求路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

let loadingIntance = ''
axios.interceptors.request.use(config => {
  if(window.sessionStorage.getItem('token')){
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }
  loadingIntance = Loading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
    text: 'Loading',
    fullscreen: true
  })
  return config
})

axios.interceptors.response.use(success => {
  if(success.status || success.status == 200){
    if(success.data.meta.status == 400 || success.data.meta.status == 401 || success.data.meta.status == 403 || success.data.meta.status == 404
    || success.data.meta.status == 422 || success.data.meta.status == 500){
      if(success.data.meta.msg){
        Message.error(success.data.meta.msg)
      }
      else{
        Message.error('未知错误')
      }
      loadingIntance.close()
      return
    }
    else if(success.data.meta.status == 200 || success.data.meta.status == 201 || success.data.meta.status == 204){
      if(success.data.meta.msg){
        Message.success(success.data.meta.msg)
      }
      else{
        Message.success('操作成功')
      }
    }
    loadingIntance.close()
    return success.data
  }
},error => {
  if(error.response.code == 584 || error.response.code ){
    Message.error('服务器被吃了')
  }
  else if(error.response.code == 403){
    Message.error('权限不足')
  }
  else if(error.response.code == 401){
    Message.error('尚未登录，请登录')
    router.replace("/")
  }
  else{
    if(error.response.data.message){
      Message.error(error.response.data.message)
    }
    else{
      Message.error('未知错误')
    }
  }
})

export const postApi = function(url,obj){
  return axios.post(url,obj)
}

export const getApi = function(url,obj){
  if(obj){
    return axios.get(url,{
      params:obj
    })
  }
  else{
    return axios.get(url)
  }
}

export const putApi = function(url,obj){
  if(obj){
    return axios.put(url,obj)
  }
  return axios.put(url)
}

export const deleteApi = function(url){
  return axios.delete(url)
}