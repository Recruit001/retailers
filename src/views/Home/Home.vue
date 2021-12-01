<template>
  <el-container class = "el-container1">
    <el-header>
      <div class = "img">
        <img src="../../assets/logo.png" alt="vue">
        <h2>电商后台管理系统</h2>
      </div>
      <el-button type="info" @click = "escLogin">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width = "collapse ? '64px' : '220px'">
        <el-menu
        background-color="rgb(55,61,65)"
        text-color="#fff"
        active-text-color = "rgb(64,158,255)"
        unique-opened
        :collapse = "collapse"
        :collapse-transition = "false"
        router
        :default-active = "itemActive">
        <div class = "change" @click = "collapse = !collapse">|||</div>
          <el-submenu :index = "item.path" v-for = "(item,index) in menuData" :key = "item.id">
            <template slot = "title">
              <i :class="iconList[index]" style= "margin-right:10px"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index = "itemChild.path" v-for = "itemChild in item.children" :key = "itemChild.id" @click = "itemClick(itemChild.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ itemChild.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        menuData:[],
        iconList:['iconfont icon-users','iconfont icon-tijikongjian','iconfont icon-shangpin','iconfont icon-danju','iconfont icon-baobiao'],
        collapse:false
      }
    },
    computed:{
      itemActive(){
        return window.sessionStorage.getItem('path')
      }
    },
    methods:{
      escLogin(){
        // 清除令牌
        window.sessionStorage.clear()
        // 返回登录页
        this.$router.replace("/")
      },
      itemClick(path){
        window.sessionStorage.setItem('path',path)
      }
    },
    created(){
      this.$getApi("/menus").then(res => {
        this.menuData = res.data
      })
    }
  }
</script>

<style lang = "less" scoped >
  .el-header{
    background-color:rgb(55,61,65);
    color:#fff;
    display:flex;
    justify-content: space-between;
    align-items: center;
    .img{
      display: inline-flex;
      align-items: center;
      img{
        height: 50px;
        margin-right: 10px;
      }
      h2{
        margin:0px;
        padding:0px;
      }
    }
  }
  .el-container1{
    height: 100vh;
  }
  .el-menu{
    height:100%;
    user-select:none;
  }
  .change{
    background-color:rgb(74,80,100);
    height:40px;
    text-align: center;
    line-height: 40px;
    color:#fff;
    cursor:pointer;
    letter-spacing: 2px;
    user-select:none;
  }
</style>
