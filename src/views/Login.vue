<template>
  <div>
    <el-form ref="form" :model="dataList" label-width="auto" :rules = "rules">
      <h3>系统登录</h3>
      <el-form-item prop = "username">
        <el-input v-model = "dataList.username" placeholder = "用户名" ></el-input>
      </el-form-item>
      <el-form-item prop = 'psd'>
        <el-input v-model = "dataList.psd" show-password placeholder = "请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop = "code">
        <el-input placeholder="请输入验证码
        " v-model="dataList.code">
          <template slot="append">.com</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="dataList.checked">记住我</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%" @click = 'onSubmit'>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { postApi } from '@/tools/request.js'
  
  export default {
    name: 'Login',
     data() {
          return {
            dataList: {
              username: '',
              psd: '',
              code: '',
              checked: false
            },
            rules: {
              username: [
                { required: true,message: '请输入用户名',trigger: 'blur' }
              ],
              psd: [
                { required: true,message: '请输入密码',trigger: 'blur' }
              ],
              code: [
                { required: true,message: '请输入验证码',trigger: 'blur' }
              ]
            }
          }
        },
        methods: {
          onSubmit() {
            this.$refs.form.validate((b) => {
              if(!b){
                 this.$message.error('请填写完整的信息在登录哦 ！');
              }
              else{
                const obj = {
                  username:this.dataList.username,
                  password:this.dataList.psd
                }
                postApi('/login',obj).then(res => {
                  if(res){
                    // 登录成功，将令牌保存到session
                    window.sessionStorage.setItem('token',res.data.token)
                    // 跳转到主页
                    this.$router.replace("/home")
                  }
                  this.$refs.form.resetFields()
                })
              }
            })
          }
        }
  }
</script>

<style lang = 'less' scoped >
  .el-form{
    width:500px;
    padding:20px 40px;
    border-radius: 8px;
    box-shadow: 0px 0px 30px rgba(0,0,0,.5);
    position: absolute;
    top:45%;
    left:50%;
    transform:translate(-50%,-50%);
    h3{
      text-align: center;
      margin-bottom: 40px;
    }
  }
</style>
