<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span = "8">
          <el-input placeholder="请输入内容" v-model = "getOrderArray.query">
            <el-button slot="append" icon="el-icon-search" @click = "searchOk"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格 -->
      <el-table
      :data = "orderTableData"
      border
      stripe>
        <el-table-column
        type = "index"
        label = "#"></el-table-column>
        <el-table-column
        label = "订单编号"
        prop = "order_number"></el-table-column>
        <el-table-column
        label = "订单价格"
        prop = "order_price"
        width = "80px"></el-table-column>
        <el-table-column
        label = "是否付款"
        prop = "pay_status"
        width = "120px">
          <template v-slot:default = "scope">
            <el-tag type="success" v-if = "scope.row.pay_status == 1">已付款</el-tag>
            <el-tag type="danger" v-else >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
        label = "是否发货"
        prop = "is_send"
        width = "80px"></el-table-column>
         <el-table-column
          label="下单时间"
          width = "300px">
          <template v-slot:default = "scope">
            {{ scope.row.create_time | dataTransform }}
          </template>
        </el-table-column>
        <el-table-column 
        label = "操作"
        width = "200px">
          <template v-slot:default = "scope">
            <el-tooltip effect="dark" content="修改地址" placement="top-start" :enterable = 'false'>
              <el-button type="primary" icon="el-icon-edit" size = "mini" @click = "editAddressVisible = true"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="物流进度" placement="top-start" :enterable = 'false'>
              <el-button type="success" icon="el-icon-location" size = "mini" @click = "processOk(scope)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getOrderArray.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="getOrderArray.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressVisible"
      width="50%"
      @close = "editAddressClose">
      <el-form
      ref = "editAddressForm"
      :model = "editAddressFormData"
      :rules = 'editAddressRules'
      label-width = "90px">
        <el-form-item label = "省市区/县" prop = "editValue">
          <el-cascader
            v-model="editAddressFormData.editValue"
            :options="cascaderData"
            :props="{ expandTrigger: 'hover' }" style = "width:100%;"></el-cascader>
        </el-form-item>
        <el-form-item label = "详细地址" prop = "inputValue">
          <el-input v-model = "editAddressFormData.inputValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度 -->
    <el-dialog
      title="物流进度"
      :visible.sync="processVisible"
      width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in processData"
          :key="index"
          :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import citydata from './citydata.js'
  import processD from './process.js'
  export default{
    name: 'Order',
    data(){
      return {
        getOrderArray: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        orderTableData: [],
        // 数据总量
        total: 0,
        // 修改地址面板
        editAddressVisible: false,
        // 修改地址表单数据
        editAddressFormData:{
          editValue: [],
          inputValue: ''
        },
        // 级联数据
        cascaderData: [],
        // 编辑规则
        editAddressRules: {
          editValue: [
            {required:true,message:'地方选择不能为空哦',trigger: "blur"}
          ],
          inputValue: [
            {required:true,message:'详细地址不能为空哦',trigger: "blur"}
          ]
        },
        processVisible: false,
        processData: []
      }
    },
    methods:{
      async getOrderTabelData(){
        const {data: res} = await this.$getApi('orders',this.getOrderArray)
        this.total = res.total
        this.orderTableData = res.goods
      },
      handleSizeChange(size){
        this.getOrderArray.pagesize = size
        this.getOrderTabelData()
      },
      handleCurrentChange(page){
        this.getOrderArray.pagenum = page
        this.getOrderTabelData()
      },
      searchOk(){
        this.getOrderTabelData()
      },
      // 关闭修改地址面板时候处理的函数
      editAddressClose(){
        this.$refs.editAddressForm.resetFields()
      },
      processOk(scope){
        this.processVisible = true
      }
    },
    created(){
      this.getOrderTabelData()
      this.cascaderData = citydata
      this.processData = processD
      console.log(this.processData)
    }
  }
</script>

<style lang = 'less' scoped >
</style>
