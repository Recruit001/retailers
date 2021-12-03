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
            v-model="value"
            :options="options"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Params'
  }
</script>

<style lang = 'less' scoped >
  .checkCate{
    margin:20px 0px;
  }
</style>
