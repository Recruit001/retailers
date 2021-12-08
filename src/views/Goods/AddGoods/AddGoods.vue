<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable = "false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
      :active="stepActive - 0" 
      finish-status="success"
      align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
      ref = 'addGoodsForm'
      :model = "addGoodsData"
      :rules = "addGoodsRules"
      label-position = "top">
      <!-- 左侧导航栏 -->
        <el-tabs
        tab-position="left"
        v-model = "stepActive"
        :before-leave = 'changeStep'>
        <!-- 基本信息 -->
          <el-tab-pane label="基本信息">
            <el-form-item label = '商品名称' prop = 'goods_name'>
              <el-input v-model.trim = 'addGoodsData.goods_name'></el-input>
            </el-form-item>
            <el-form-item label = '商品价格' prop = 'goods_price'>
              <el-input v-model.number = 'addGoodsData.goods_price' type = "number"></el-input>
            </el-form-item>
            <el-form-item label = '商品重量' prop = 'goods_weight'>
              <el-input v-model.number = 'addGoodsData.goods_weight' type = "number"></el-input>
            </el-form-item>
            <el-form-item label = '商品数量' prop = 'goods_number'>
              <el-input v-model.number = 'addGoodsData.goods_number' type = "number" ></el-input>
            </el-form-item>
            <el-form-item label = '商品分类' prop = 'goods_cat'>
              <el-cascader
                v-model="addGoodsData.goods_cat"
                :options="cateData"
                :props="cateArray"
                @change = "cateChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品动态参数 -->
          <el-tab-pane label="商品参数">
            <el-form-item v-for = "item in manyParamsData" :label="item.attr_name" :key = 'item.attr_id' >
              <el-checkbox-group v-model="item.attr_check">
                <el-checkbox v-for = "item1 in item.attr_vals" :label="item1" border ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性">
            <el-form-item :label = 'itemOnly.attr_name' v-for = "itemOnly in onlyParamsData">
              <el-input v-model.trim = 'itemOnly.attr_vals'></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 上传商品图片 -->
          <el-tab-pane label="商品图片">
            <!-- 因为el-upload 使用的是自定义的ajax 没使用axios 所以得重新传进token进行权限控制 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers = "headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success = "updataSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容管理 -->
          <el-tab-pane label="商品内容">
            <quill-editor v-model = "addGoodsData.goods_introduce">
            </quill-editor>
            <el-button type = "primary" @click = "addGoods" style = "margin-top:15px;">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="pictureVisible"
      width="50%">
      <img :src="pictureUrl" alt="" width = "100%" height = "100%">
    </el-dialog>
  </div>
</template>

<script>
  export default{
    name: 'AddGoods',
    data(){
      return{
        stepActive: '0',
        // 添加表单数据
        addGoodsData: {
          goods_name: '',
          goods_cat: '',
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          goods_introduce: '',
          pics: [],
          attrs: '',
          attr_check: []
        },
        // 添加表单验证规则
        addGoodsRules:{
          goods_name:[
            {required:true,message:'商品名称不能为空',trigger:'blur'}
          ],
          goods_price:[
            {required:true,message:'商品价格不能为空',trigger:'blur'}
          ],
          goods_weight:[
            {required:true,message:'商品重量不能为空',trigger:'blur'}
          ],
          goods_number:[
            {required:true,message:'商品数量不能为空',trigger:'blur'}
          ],
          goods_cat:[
            {required:true,message:'商品分类不能为空',trigger:'blur'}
          ]
        },
        // 分类数据
        cateData: [],
        // 分类列表属性对应数据
        cateArray: {
          label: 'cat_name',
          value: 'cat_id'
        },
        // 动态参数数据
        manyParamsData: [],
        // 静态属性数据
        onlyParamsData: [],
        // el-updata 请求头设置
        headerObj:{
          Authorization: window.sessionStorage.getItem('token')
        },
        pictureVisible:false,
        pictureUrl: ''
      }
    },
    computed:{
      cat_id(){
        return this.addGoodsData.goods_cat[2]
      }
    },
    methods:{
      async getCateData(){
        const {data: res} = await this.$getApi('categories')
        this.cateData = res
      },
      changeStep(activeName,oldActiveName){
        if(oldActiveName == 0){
          if(this.addGoodsData.goods_cat.length == 0
          || this.addGoodsData.goods_name.length == 0
          || (this.addGoodsData.goods_number + '').length == 0
          || this.addGoodsData.goods_price == 0
          || this.addGoodsData.goods_weight == 0){
            this.$message.error('请完善商品基本信息')
            return false
          }
        }
      },
      // 获取动态数据
      async getManyParamsData(api){
        const {data: res} = await this.$getApi(`categories/${this.cat_id}/attributes`,{sel: api})
        if(api == 'many'){
          res.forEach(item => {
            if(item.attr_vals.length == 0){
              this.$set(item,'attr_vals',[])
            }else{
              this.$set(item,'attr_vals',item.attr_vals.split(' '))
            }
            this.$set(item,'attr_check',item.attr_vals)
          })
        }
        return res
      },
      async cateChange(){
        if(this.addGoodsData.goods_cat.length != 3){
          return this.addGoodsData.goods_cat = []
        }
        else{
          this.manyParamsData = await this.getManyParamsData('many')
          this.onlyParamsData = await this.getManyParamsData('only')
        }
      },
      // 处理图片点击预览
      handlePreview(file){
        this.pictureVisible = true
        this.pictureUrl = file.response.data.url
      },
      // 处理图片点击关闭按钮
      handleRemove(file){
        let filePath = file.response.data.tmp_path
        let index = this.addGoodsData.pics.findIndex(item => {
          return item.pic == filePath
        })
        this.addGoodsData.pics.splice(index,1)
        console.log(this.addGoodsData.pics)
      },
      // 图片上传成功后执行的钩子函数
      updataSuccess(respond){
        // 1、创建对象
        let updataObj = {
          pic:respond.data.tmp_path
        }
        // 2、使用push放入添加商品的数组中
        this.addGoodsData.pics.push(updataObj)
      },
      // 添加商品按钮点击
      async addGoods(){
        const formData = {
          goods_name: this.addGoodsData.goods_name,
          goods_cat:this.addGoodsData.goods_cat.join(','),
          goods_price: this.addGoodsData.goods_price,
          goods_number: this.addGoodsData.goods_number,
          goods_weight: this.addGoodsData.goods_weight,
          goods_introduce: this.addGoodsData.goods_introduce,
          pics:this.addGoodsData.pics,
          attrs: []
        }
        // 动态参数
        this.manyParamsData.forEach(item => {
          if(!item.attr_check) return
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_check.join(" ")
          }
          formData.attrs.push(obj)
        })
        // 静态属性
        this.onlyParamsData.forEach(item => {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          formData.attrs.push(obj)
        })
        console.log(formData)
        const {meta: res} = await this.$postApi('goods',formData)
        if(res.status == '201'){
          this.$router.replace('/goods')
        }
      }
    },
    created(){
      this.getCateData()
    },
  }
</script>

<style lang = 'less' scoped >
  .el-steps{
    margin:20px 0px;
  }
  /deep/ .ql-container{
    min-height:400px !important;
  }
</style>
