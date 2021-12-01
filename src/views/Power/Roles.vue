<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type = "primary" @click = "addRolesVisible = true">添加角色</el-button>
      <el-table
      :data = "rolesData"
      border
      stripe
      >
        <el-table-column
        type = "expand">
        <template v-slot:default = "scope">
          <el-row  v-for = "(item1,i1) in scope.row.children" :class = "[i1 == 0 ? 'bTop' : '','roles-row','bBottom','table-flex']">
            <el-col :span = "4">
              <el-tag class = "el-t" closable @close = 'tagClose(scope,item1.id)' >{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span = "20">
              <el-row v-for = "(item2,i2) in item1.children" :class = "[i2 == 0 ? '':'bTop','table-flex']" >
                <el-col :span = "8">
                  <el-tag class = "el-t" type = 'success'closable @close = 'tagClose(scope,item2.id)' >{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span = "16">
                  <el-tag class = "el-t" type = 'warning' closable v-for = "(item3,i3) in item2.children"
                  style = "margin-right:10px" @close = 'tagClose(scope,item3.id)'>{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        </el-table-column>
        <el-table-column type = "index" label = "#">
        </el-table-column>
        <el-table-column
        label = "角色名称"
        prop = "roleName"
        ></el-table-column>
        <el-table-column
        label = "角色描述"
        prop = "roleDesc"
        ></el-table-column>
        <el-table-column
        label = "操作"
        >
        <template v-slot:default = "scope">
          <el-button type="primary" icon="el-icon-edit" size = "mini" @click = 'editRoles(scope.row.id)'>编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size = "mini" @click = 'deleteRoles(scope.row.id)'>删除</el-button>
          <el-button type="warning" icon="el-icon-s-tools" size = "mini" @click = 'fprights(scope.row)'>分配权限</el-button>
        </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsVisible"
      width="50%"
      @close="rightsClose">
      <el-tree
      ref = "tree"
      :data = "rightsData"
      :props = "rightsProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys = "rightsKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightsRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesVisible"
      width="30%"
      @close = 'addClose'>
      <el-form
      ref = 'addRolesForm'
      :model = 'addRolesData'
      label-width = '80px'
      :rules="addRules">
        <el-form-item label = '角色名称' prop = "roleName">
          <el-input v-model.trim="addRolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label = '角色描述'>
          <el-input v-model.trim="addRolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesVisible"
      width="30%">
      <el-form
      ref = 'editRolesForm'
      :model = 'editRolesData'
      label-width = '80px'
      :rules="addRules">
        <el-form-item label = '角色名称' prop = "roleName">
          <el-input v-model.trim="editRolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label = '角色描述'>
          <el-input v-model.trim="editRolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Roles',
    data(){
      return {
        rolesData: [],
        rightsVisible: false,
        rightsData: [],
        rightsProps:{
          children: 'children',
          label: 'authName'
        },
        rightsKeys:[],
        roleId: '',
        addRolesVisible: false,
        addRolesData:{
          roleName: '',
          roleDesc: ''
        },
        addRules:{
          roleName: [
            {required:true,message:'角色名称不能为空',trigger:'blur'}
          ]
        },
        editRolesVisible: false,
        editRolesData:{}
      }
    },
    methods:{
      getRolesData(){
        this.$getApi('/roles').then(res => {
          this.rolesData = res.data
        })
      },
      async tagClose(role,rightsId){
        const {data:res} = await this.$deleteApi(`roles/${role.row.id}/rights/${rightsId}`)
        this.rolesData[role.$index].children = res
      },
      fprights(node){
        this.roleId = node.id
        this.getRightsKeys(node,this.rightsKeys)
        this.rightsVisible = true
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.rightsKeys)
        })
      },
      getRightsData(){
        this.$getApi('rights/tree').then(res => {
          this.rightsData = res.data
        })
      },
      // 递归获取三级权限的id
      getRightsKeys(node,arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getRightsKeys(item,arr)
        })
      },
      rightsClose(){
        this.rightsKeys = []
      },
      async rightsRight(){
        let arr = this.$refs.tree.getCheckedKeys()
        let rids = arr.join(',')
        await this.$postApi('roles/'+ this.roleId +'/rights',{rids:rids})
        this.rightsVisible = false
        await this.getRolesData()
      },
      addRolesOk(){
        this.$refs.addRolesForm.validate(async check => {
          if(check){
            await this.$postApi('roles',this.addRolesData)
            this.$refs.addRolesForm.resetFields()
            this.addRolesVisible = false
            await this.getRolesData()
          }
          else{
            this.$message.error('角色名称不能为空')
          }
        })
      },
      addClose(){
        console.log(this.$refs.addRolesForm.resetFields)
        this.$refs.addRolesForm.resetFields()
      },
      async deleteRoles(id){
        const res = await this.$confirm('此操作将永久删除该角色，是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(res == 'confirm'){
          await this.$deleteApi('roles/' + id)
          this.getRolesData()
        }
        else{
          this.$message.info('已取消删除')
        }
      },
      async editRoles(id){
        const { data:res } = await this.$getApi('roles/' + id)
        this.editRolesData = res
        this.editRolesVisible = true
      },
      editRolesOk(){
        const obj = {
          roleName: this.editRolesData.roleName,
          roleDesc: this.editRolesData.roleDesc
        }
        this.$refs.editRolesForm.validate(async check => {
          if(check){
            await this.$putApi('roles/' + this.editRolesData.roleId,obj)
            await this.getRolesData()
          }
          else{
            this.$message.info('编辑已取消')
          }
        })
        this.editRolesVisible = false
      }
    },
    created(){
      this.getRolesData()
      this.getRightsData()
    }
  }
</script>

<style lang = 'less' scoped >
</style>
