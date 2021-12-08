<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter = '20'>
        <!-- 搜索框 -->
        <el-col :span = '8'>
          <el-input placeholder="请输入内容" v-model="getGoodsArray.query" clearable @clear = 'searchGoods()'>
            <el-button slot="append" icon="el-icon-search" @click = 'searchGoods'></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span = "4">
          <el-button type = "primary" @click = "$router.push('/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格数据 -->
      <el-table
      :data = "goodsTabelData"
      border>
        <el-table-column
        label = "#"
        type = "index"></el-table-column>
        <el-table-column
        label = "商品名称"
        prop = "goods_name"></el-table-column>
        <el-table-column
        label = "商品价格(元)"
        prop = "goods_price"
        width="120px"></el-table-column>
        <el-table-column
        label = "商品重量"
        prop = "goods_weight"
        width = "100px"></el-table-column>
        <el-table-column
        label = "创建时间"
        width = "180px">
          <template v-slot:default = 'scope'>
            {{ scope.row.add_time | dataTransform }}
          </template>
        </el-table-column>
        <el-table-column
        label = "操作"
        width = "300px">
          <template v-slot:default = "scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click = 'editGoods(scope)'></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click = "deleteGoods(scope)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="goodsHandleSizeChange"
        @current-change="goodsHandleCurrentChange"
        :current-page="getGoodsArray.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="getGoodsArray.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsTotal">
      </el-pagination>
    </el-card>
    <!-- 修改商品列表 -->
    <el-dialog
      title="修改商品"
      :visible.sync="editVisible"
      width="50%"
      @close = "editClose">
      <el-form
      ref = "editForm"
      :model = "editFormData"
      :rules = "editRules">
        <el-form-item label = "商品名称" prop = "goods_name">
          <el-input v-model = "editFormData.goods_name"></el-input>
        </el-form-item>
        <el-form-item label = "商品价格" prop = "goods_price">
          <el-input v-model.number = "editFormData.goods_price" type = "number"></el-input>
        </el-form-item>
        <el-form-item label = "商品数量" prop = "goods_number">
          <el-input v-model.number = "editFormData.goods_number" type = "number"></el-input>
        </el-form-item>
        <el-form-item label = "商品重量" prop = "goods_weight">
          <el-input v-model.number = "editFormData.goods_weight" type = "number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'List',
    data(){
      return {
        goodsTabelData: [],
        getGoodsArray: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsTotal: 0,
        // 编辑商品页面是否开启
        editVisible: false,
        // 编辑商品数据
        editFormData: {
          goods_name: '',
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          goods_introduce: '',
          goods_cat: [],
          pics: [],
          attrs: []
        },
        // 编辑商品数据表单规则
        editRules:{
          goods_name: [
            {required: true,message: "商品名称不能为空",trigger: "blur"}
          ],
          goods_price: [
            {required: true,message: "商品价格不能为空",trigger: "blur"}
          ],
          goods_number: [
            {required: true,message: "商品数量不能为空",trigger: "blur"}
          ],
          goods_weight: [
            {required: true,message: "商品重量不能为空",trigger: "blur"}
          ]
        },
        goods_id: ''
      }
    },
    methods:{
      async getGoodsTableData(){
        const {data: res} = await this.$getApi('goods',this.getGoodsArray)
        this.goodsTotal = res.total
        this.goodsTabelData = res.goods
        console.log(res)
      },
      async goodsHandleSizeChange(size){
        this.getGoodsArray.pagesize = size
        await this.getGoodsTableData()
      },
      async goodsHandleCurrentChange(page){
        this.getGoodsArray.pagenum = page
        await this.getGoodsTableData()
      },
      searchGoods(){
        this.getGoodsTableData()
      },
      async deleteGoods(scope){
        const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(result == "confirm"){
          await this.$deleteApi('goods/' + scope.row.goods_id)
          await this.getGoodsTableData()
        }
        else{
          this.$message.info('已取消删除')
        }
      },
      async editGoods(scope){
        this.editVisible = true
        this.goods_id = scope.row.goods_id
        const {data: res}= await this.$getApi('goods/' + scope.row.goods_id)
        console.log(res)
        for(let key in this.editFormData){
          this.editFormData[key] = res[key]
        }
      },
      editClose(){
        this.$refs.editForm.resetFields()
      },
      async editOk(){
        this.editVisible = false
        await this.$putApi("goods/" + this.goods_id,this.editFormData)
        await this.getGoodsTableData()
      }
    },
    created(){
      this.getGoodsTableData()
    }
  }
</script>

<style lang = 'less' scoped >
</style>
