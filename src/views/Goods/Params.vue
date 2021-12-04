<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告信息 -->
      <el-alert
        :closable="false"
        title="注意: 只允许第三级分类设置相关参数!"
        type="warning"
        show-icon>
      </el-alert>
      <!-- 分类选择 -->
      <el-row class = 'checkCate'>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="cateValue"
            :options="cateData"
            :props = 'cateProps'
            clearable
            @change="cateHandleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮 -->
          <el-button type = 'primary' :disabled = 'buttonDisabled' @click = 'addParamsVisible = true'>添加参数</el-button>
          <!-- 表格布局 -->
          <el-table
          :data = "paramsTable"
          border>
            <el-table-column type = "expand">
              <template v-slot:default = "scope" >
                <div class="paramsTag">
                  <el-tag v-for = "(item,index) in scope.row.attr_vals" :key = "index" closable @close="tagClose(index,scope)">{{ item }}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputParamsVisible"
                    v-model="scope.row.inputValue"
                    ref = 'paramsInput'
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column type = 'index' label = '#'></el-table-column>
            <el-table-column 
            label = '参数名称' prop = "attr_name"></el-table-column>
            <el-table-column label = "操作">
              <template v-slot:default = 'scope'>
                <el-button type="primary" icon="el-icon-edit" size = "mini" @click = 'editBegin(scope)'>修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size = "mini" @click = 'deleteParams(scope)' >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮 -->
          <el-button type = 'primary' :disabled = 'buttonDisabled' @click = 'addParamsVisible = true'>添加属性</el-button>
          <!-- 表格布局 -->
          <el-table
          :data = "paramsTable"
          border>
            <el-table-column type = "expand">
              <template v-slot:default = "scope" >
                <div class="paramsTag">
                  <el-tag v-for = "(item,index) in scope.row.attr_vals" :key = "index" closable @close="tagClose(index,scope)">{{ item }}</el-tag>
                  <el-input
                    class="input-new-tag"
                    ref = 'paramsInput'
                    v-if="scope.row.inputParamsVisible"
                    v-model="scope.row.inputValue"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column type = 'index' label = '#'></el-table-column>
            <el-table-column 
            label = '参数名称' prop = "attr_name"></el-table-column>
            <el-table-column label = "操作">
              <template v-slot:default = 'scope'>
                <el-button type="primary" icon="el-icon-edit" size = "mini" @click = 'editBegin(scope)' >修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size = "mini" @click = "deleteParams(scope)" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        </el-tabs>
    </el-card>
    
    <!-- 添加参数 -->
    <el-dialog
      :title="'添加' + titleParams"
      :visible.sync="addParamsVisible"
      width="30%"
      @close = "addParamsClose">
      <el-form
      ref = "addParamsForm"
      :model = "addParamsData"
      :rules = "addParamsRules"
      label-width = "80px">
        <el-form-item label = "参数名称" prop = 'attr_name'>
          <el-input v-model.trim = "addParamsData.attr_name" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数 -->
    <el-dialog
      title="修改参数"
      :visible.sync="editParamsVisible"
      width="30%"
      @close = "editParamsClose">
      <el-form
      ref = "editParamsForm"
      :model = "editParamsData"
      :rules = "addParamsRules"
      label-width = "80px">
        <el-form-item label = "参数名称" prop = 'attr_name'>
          <el-input v-model.trim = "editParamsData.attr_name" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Params',
    data(){
      return{
        // 级联选中的 value 数组
        cateValue: [],
        // 级联数据源
        cateData: [],
        // 级联数据源对应的标签
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        // 选中的分类、ID
        cat_id: '',
        // 标签页激活的页面
        activeName:'many',
        // 参数数据
        paramsTable: [],
        // 控制按钮是否可用
        buttonDisabled: true,
        // 控制添加参数
        addParamsVisible: false,
        // 表单数据
        addParamsData: {
          attr_name: ''
        },
        // 参数验证规则
        addParamsRules:{
          attr_name: [
            {required:true,message:'参数名称不能为空',trigger:'blur'}
          ]
        },
        // 控制的展现修改面板
        editParamsVisible: false,
        // 修改数据
        editParamsData:{
          attr_id: 0,
          attr_name: '',
          attr_vals: ''
        }
      }
    },
    methods:{
      async getCateData(){
        const {data: res} = await this.$getApi('categories')
        this.cateData = res
      },
      async getParamsData(id){
        const {data:res} = await this.$getApi('categories/'+ id +'/attributes',{sel:this.activeName})
        this.paramsTable = res
        this.paramsTable.forEach(item => {
          // 使用this.$set(arr,index,new值) 来赋值 让 为初始化的数据 的数据改变与页面保持一致
          const str = item.attr_vals.split(' ')
          if(str.length == 1 && str[0] == ''){
            this.$set(item,'attr_vals',[])
          }
          else{
            this.$set(item,'attr_vals',item.attr_vals.split(' '))
          }
          this.$set(item,'inputParamsVisible',false)
          this.$set(item,'inputValue','')
        })
      },
      cateHandleChange(){
        if(this.cateValue.length != 3){
          this.cateValue = []
          this.cat_id = ''
          this.paramsTable = []
          this.buttonDisabled = true
        }
        else{
          this.cat_id = this.cateValue[this.cateValue.length - 1]
          this.getParamsData(this.cat_id)
          this.buttonDisabled = false
        }
      },
      handleClick() {
        if(this.cat_id == '') return 
        this.getParamsData(this.cat_id)
      },
      // 点击添加标签按钮 展示输入框
      showInput(scope){
        scope.row.inputParamsVisible = true
        this.$nextTick(() => {
          this.$refs.paramsInput.$refs.input.focus()
        })
      },
      // input 失去焦点之后
      async handleInputConfirm(row){
        if(row.inputValue.trim().length == 0){
          row.inputValue = ''
          row.inputParamsVisible = false
          return
        }
        row.attr_vals.push(row.inputValue)
        row.inputValue = ''
        await this.$putApi('categories/'+ this.cat_id +'/attributes/' + row.attr_id,{
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        })
        row.inputParamsVisible = false
      },
      async tagClose(index,scope){
        scope.row.attr_vals.splice(index,1)
        await this.$putApi('categories/'+ this.cat_id +'/attributes/' + scope.row.attr_id,{
          attr_name: scope.row.attr_name,
          attr_sel: this.activeName,
          attr_vals: scope.row.attr_vals.join(' ')
        })
      },
      addParamsClose(){
        this.$refs.addParamsForm.resetFields()
      },
      addParamsOk(){
        this.$refs.addParamsForm.validate(async check => {
          if(check){
            await this.$postApi('categories/'+ this.cat_id +'/attributes',{
              attr_name: this.addParamsData.attr_name,
              attr_sel: this.activeName
            })
            await this.getParamsData(this.cat_id)
            this.addParamsVisible = false
          }
          else{
            this.$message.error('参数名称不能为空')
          }
        })
      },
      // 修改面板关闭
      editParamsClose(){
        this.$refs.editParamsForm.resetFields()
      },
      // 修改模块确定
      editParamsOk(){
        this.$refs.editParamsForm.validate(async check => {
          if(check){
            await this.$putApi('categories/' + this.cat_id + '/attributes/' + this.editParamsData.attr_id,{
              attr_name: this.editParamsData.attr_name,
              attr_sel: this.activeName,
              attr_vals: this.editParamsData.attr_vals
            })
            await this.getParamsData(this.cat_id)
            this.editParamsVisible = false
          }
          else{
            this.$message.error('参数名称不能为空')
          }
        })
      },
      // 点击修改按钮
      async editBegin(scope){
        const {data: res} = await this.$getApi('categories/'+ this.cat_id +'/attributes/' + scope.row.attr_id,{attr_sel: this.activeName})
        this.editParamsData.attr_name = res.attr_name
        this.editParamsData.attr_id = res.attr_id
        this.editParamsData.attr_vals = res.attr_vals
        this.editParamsVisible = true
      },
      // 点击删除参数
      async deleteParams(scope){
        const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(result == 'confirm'){
          await this.$deleteApi('categories/' + this.cat_id + '/attributes/' + scope.row.attr_id)
          await this.getParamsData(this.cat_id)
        }
        else{
          this.$message.info('已取消删除')
        }
      }
    },
    computed:{
      titleParams(){
        if(this.activeName == 'many'){
          return '动态参数'
        }
        else{
          return '静态属性'
        }
      }
    },
    created(){
      this.getCateData()
    }
  }
</script>

<style lang = 'less' scoped >
  .checkCate{
    margin:20px 0px;
  }
  .paramsTag{
    padding:20px 48px;
    .el-tag{
      margin:0px 7px;
    }
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
