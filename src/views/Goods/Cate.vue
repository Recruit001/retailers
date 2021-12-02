<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type = "primary" @click = 'addCateVisible = true'>添加分类</el-button>
      <!-- 表格区域 -->
      <zk-table
        class = "cateTable"
        ref="cateTable"
        index-text="#"
        :show-index = "true"
        :data="cateTabelData"
        :columns = "columnsArray"
        :selection-type = "false"
        :show-row-hover = 'false'
        :expand-type = 'false'
        border>
        <!-- 是否有效结构 -->
        <template v-slot:effective = 'scope'>
          <i class="el-icon-success effeI" v-if = '!scope.row.cat_deleted' ></i>
          <i class="el-icon-error effeI" v-else ></i>
        </template>
        <template v-slot:level = 'scope'>
          <el-tag size = "mini" v-if = 'scope.row.cat_level == 0'>一级</el-tag>
          <el-tag type="success" size = "mini" v-else-if = "scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" size = "mini" v-else >三级</el-tag>
        </template>
        <template v-slot:cz = 'scope'>
          <el-button type="primary" icon="el-icon-edit" size = 'mini' @click = 'editCate(scope.row)'>编辑</el-button>
          <el-button type="danger" icon="el-icon-delete"  size = 'mini' @click = 'deleteCate(scope.row.cat_id)' >删除</el-button>
        </template>
      </zk-table>
      <!-- 分页效果 -->
      <el-pagination
        @size-change="cateSizeChange"
        @current-change="cateCurrentChange"
        :current-page="getCateArray.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="getCateArray.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals">
      </el-pagination>
    </el-card>
    <!-- 添加用户dialog -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="30%"
      @close="addCateClose">
      <el-form
      ref = 'addCateForm'
      :model = 'addCateData'
      label-width = '85px'
      :rules = "addCateRules">
        <el-form-item label = '分类名称:' prop = 'cat_name'>
          <el-input v-model.trim = "addCateData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label = '父级分类:'>
          <el-cascader
            class = 'addCateCascader'
            v-model="addCatevalue"
            :options="addOptions"
            :props="{ expandTrigger: 'hover',checkStrictly: true }"
            @change="addCateChange"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="addCateVisible= false">取 消</el-button>
        <el-button type="primary" @click="addCateOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog
      title="修改分类名称"
      :visible.sync="editCateVisible"
      width="30%"
      @close="editCateClose">
      <el-form
      ref = 'editCateForm'
      :model = 'editCateData'
      label-width = '85px'
      :rules = "addCateRules">
        <el-form-item label = '分类名称:' prop = 'cat_name'>
          <el-input v-model.trim = "editCateData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="editCateVisible= false">取 消</el-button>
        <el-button type="primary" @click="editCateOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Cate',
    data(){
      return{
        cateTabelData: [],
        getCateArray: {
          pagenum: 1,
          pagesize: 5
        },
        totals: 0,
        columnsArray: [
          {
            label: '分类名词',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            type: 'template',
            template: 'effective'
          },
          {
            label: '排序',
            prop: 'cat_level',
            type: 'template',
            template: 'level'
          },
          {
            label: '操作',
            type: 'template',
            template: 'cz'
          }
        ],
        addCateVisible: false,
        addCateData: {
          cat_pid: 0,
          cat_name: '',
          cat_level: 0
        },
        addCateRules:{
          cat_name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
          ]
        },
        addCatevalue: [],
        addOptions:[],
        // 修改分类数据
        editCateVisible: false,
        editCateData: {
          cat_id: 0,
          cat_name: ''
        }
      }
    },
    methods:{
      getCateTableData(){
        this.$getApi('categories',this.getCateArray).then(res => {
          this.totals = res.data.total
          this.cateTabelData = res.data.result
        })
      },
      initAddOptions(data,arr){
        data.forEach((item,index) => {
          arr[index] = {}
          arr[index].label = item.cat_name
          arr[index].value = item.cat_id
          if(item.children){
            arr[index].children = []
            this.initAddOptions(item.children,arr[index].children)
          }
          else{
            return arr
          }
        })
      },
      async getCateDialog(){
        const res = await this.$getApi('categories',{type:2})
        this.initAddOptions(res.data,this.addOptions)
      },
      cateSizeChange(size){
        this.getCateArray.pagesize = size
        this.getCateTableData()
      },
      cateCurrentChange(page){
        this.getCateArray.pagenum = page
        this.getCateTableData()
      },
      addCateChange(){
        if(this.addCatevalue.length == 0) {
          this.addCateData.cat_level = 0
          this.addCateData.cat_pid = 0
        }
        else if(this.addCatevalue.length == 1) {
          this.addCateData.cat_level = 1
          this.addCateData.cat_pid = this.addCatevalue[0]
        }
        else{
          this.addCateData.cat_pid = this.addCatevalue[1]
          this.addCateData.cat_level = 2
        }
      },
      addCateClose(){
        this.$refs.addCateForm.resetFields()
        this.addCatevalue = []
        this.addCateChange()
      },
      addCateOk(){
        this.$refs.addCateForm.validate(async check => {
          if(check){
            await this.$postApi('categories',this.addCateData)
            this.$router.go(0)
            this.addCateVisible = false
          }
          else{
            this.$message.error('分类名称不能为空')
          }
        })
      },
      async editCate(row){
        this.editCateData.cat_id = row.cat_id
        this.editCateData.cat_name = row.cat_name
        this.editCateVisible = true
      },
      editCateClose(){
        this.$refs.editCateForm.resetFields()
      },
      editCateOk(){
        this.$refs.editCateForm.validate(async check => {
          if(check){
            await this.$putApi('categories/' + this.editCateData.cat_id,{cat_name: this.editCateData.cat_name})
            this.getCateTableData()
            this.editCateVisible = false
          }
          else{
            this.$message.error('分类名词不能为空')
          }
        })
      },
      // 删除分类
      async deleteCate(id){
        const res = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(res == 'confirm'){
          await this.$deleteApi('categories/' + id)
          this.getCateTableData()
        }
        else{
          this.$message.info('已取消删除')
        }
      }
    },
    created(){
      this.getCateTableData()
      this.getCateDialog()
    }
  }
</script>

<style lang = 'less' scoped >
  .cateTable{
    margin:20px 0px;
  }
  .effeI{
    color:#67C23A;
  }
  .addCateCascader{
    width:100%;
  }
</style>
