<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 输入框跟按钮 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="requestData.query" clearable @clear = "getData">
            <el-button slot="append" icon="el-icon-search" @click = "getData"></el-button>
          </el-input>
        </el-col>
        <el-col :span = "4">
          <el-button type="primary" @click="dialogVisible = true" >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格信息 -->
      <el-table
      :data = "userData"
      border
      stripe
      >
        <el-table-column
        type="index"
        label = "#"
        width="50">
        </el-table-column>
        <el-table-column
        prop = 'username'
        label = "姓名"
        ></el-table-column>
        <el-table-column
        prop = 'email'
        label = "邮箱"
        ></el-table-column>
        <el-table-column
        prop = 'mobile'
        label = "电话"
        ></el-table-column>
        <el-table-column
        prop = 'role_name'
        label = "角色"
        ></el-table-column>
        <el-table-column
        label = "状态"
        >
        <template v-slot:default = "scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change = "userStateChange(scope.row)"
            >
          </el-switch>
        </template>
        </el-table-column>
        <el-table-column
        label = "操作"
        >
        <template v-slot:default = "scope">
          <el-tooltip 
          content = "编辑用户"
          placement = "top"
          :enterable = "false">
            <el-button type="primary" icon="el-icon-edit" size = "small" @click = "editUser(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip
          content = "删除用户"
          placement = "top"
          :enterable = "false">
            <el-button type="danger" icon="el-icon-delete" size = "small" @click = "deleteUser(scope.row.id)" ></el-button>
          </el-tooltip>
          <el-tooltip
          content = "分配角色"
          placement = "top"
          :enterable = "false">
            <el-button type="warning" icon="el-icon-s-tools" size = "small" @click = "fpRoles(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
        </el-table-column>
      </el-table>
      <!-- 分页设置 -->
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="requestData.pagenum"
            :page-sizes="[1, 2, 3, 5]"
            :page-size="requestData.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals">
          </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close = "diaClose"
      >
      <el-form ref = "addForm"
       :model = "addForm"
       label-width="70px"
       status-icon
       :rules = "addRules"
       >
        <el-form-item label = "用户名" prop = "username">
          <el-input v-model.trim="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label = "密码" prop = "password">
          <el-input v-model.trim="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label = "邮箱" prop = "email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label = "手机" prop = "mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editClose">
      <el-form 
      ref = "editForm"
      :model = "editData"
      label-width = "70px"
      :rules = "editRules">
        <el-form-item label = "用户名">
          <el-input v-model = "editData.username"
          disabled></el-input>
        </el-form-item>
        <el-form-item label = "邮箱" prop = "email">
          <el-input v-model = "editData.email"></el-input>
        </el-form-item>
        <el-form-item label = "手机" prop = "mobile">
          <el-input v-model.number = "editData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="rolesVisible"
      width="30%"
      @close="rolesValue = ''">
      <p class = "self-p">当前的用户：{{ fpRolesData.username }}</p>
      <p class = "self-p">当前的角色：{{ fpRolesData.roleName }}</p>
      <p class="self-p">
        <span>分配新角色：</span>
        <el-select v-model="rolesValue" placeholder="请选择" @change="changeValue">
            <el-option
              v-for="item in initRolesData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="fpOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'User',
    data(){
      var emailTest = (rule,value,callback) => {
        let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if(value){
          if(reg.test(value)){
            callback()
          }
          else{
            callback(new Error('请输入正确的邮箱格式'))
          }
        }
        else{
          callback()
        }
      }
      var mobileTest = (rule,value,callback) => {
        if(value){
          if(!Number.isInteger(value)){
            callback(new Error('请输入数字'))
          }
          else if(value.toString().length == 11){
            callback()
          }
          else{
            callback(new Error('请输入正确的电话号码'))
          }
        }
        else{
          callback()
        }
      }
      return {
        userData: [],
        totals: 0,
        requestData: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        dialogVisible: false,
        editDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addRules: {
          username: [
            { required: true,message: '用户名不能为空',trigger: 'blur' }
          ],
          password: [
            { required: true,message: '密码不能为空',trigger: 'blur'}
          ],
          email: [
            {  validator: emailTest,trigger: 'blur' }
          ],
          mobile: [
            { validator: mobileTest,trigger: 'blur' }
          ]
        },
        editData: {
          username: '',
          email: '',
          mobile: ''
        },
        editRules: {
          email: [
            {  validator: emailTest,trigger: 'blur' }
          ],
          mobile: [
            { validator: mobileTest,trigger: 'blur' }
          ]
        },
        rolesVisible: false,
        fpRolesData: [],
        initRolesData: [],
        rolesValue: '',
        changeRoles: {}
      }
    },
    methods:{
      handleSizeChange(size){
        this.requestData.pagesize = size
        this.getData()
      },
      handleCurrentChange(page){
        this.requestData.pagenum = page
        this.getData()
      },
      getData(){
        this.$getApi('/users',this.requestData).then(res => {
          this.userData = res.data.users
          this.totals = res.data.total
        })
      },
      userStateChange(row){
        this.$putApi(`/users/${row.id}/state/${row.mg_state}`)
      },
      addUser(){
        this.$refs.addForm.validate((go) => {
          if(go){
            this.$postApi('/users',this.addForm)
            this.getData()
            this.dialogVisible = false
          }
        })
      },
      diaClose(){
        this.$refs.addForm.resetFields()
      },
      async editUser(id){
        this.editDialogVisible = true
        const {data: res} = await this.$getApi('users/' + id)
        this.editData = res
      },
      editClose(){
        this.$refs.editForm.clearValidate()
      },
      editOk(){
        let obj = {
          id: this.editData.id,
          email: this.editData.email,
          mobile: this.editData.mobile
        }
        this.$putApi('/users/' + this.editData.id,obj)
        this.editDialogVisible = false
        this.getData()
      },
      async deleteUser(id){
        const result = await this.$confirm('此操作将永远删除用户，是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(result == 'confirm'){
          this.$deleteApi('users/' + id)
          this.$message.success('删除成功')
          this.getData()
        }
        else{
          this.$message.info('已取消删除')
        }
      },
      async fpRoles(id){
        const {data: res} = await this.$getApi('users/' + id)
        this.fpRolesData = res
        const rolesRes = await this.$getApi('roles/' + this.fpRolesData.rid)
        if(rolesRes){
          this.fpRolesData.roleName = rolesRes.data.roleName
        }
        else{
          this.fpRolesData.roleName = '超级管理员'
        }
        const {data: initData} = await this.$getApi("roles")
        this.initRolesData = initData
        this.changeRoles = {
          id:this.fpRolesData.id,
          rid:this.fpRolesData.rid
        }
        this.rolesVisible = true
      },
      async fpOk(){
        if(this.rolesValue.length != 0){
         await this.$putApi('users/'+ this.changeRoles.id +'/role',{rid:this.changeRoles.rid})
         await this.getData() 
        }
        this.rolesVisible = false
      },
      changeValue(){
        this.changeRoles.rid = this.rolesValue
      }
    },
    created(){
      this.getData()
    }
  }
</script>

<style lang = "less" scoped >
</style>
