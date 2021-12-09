<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <div id="echars-table"></div>
    </el-card>
  </div>
</template>

<script>
  // 导入echars
  import * as echarts from 'echarts'
  export default {
    name: 'Reports',
    data(){
      return {
        options: {},
        options2: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    methods:{
      async getOptionData(){
        const {data: res} = await this.$getApi('reports/type/1')
        this.options = {...this.options2,...res}
      }
    },
    async mounted(){
      let myChart = echarts.init(document.querySelector('#echars-table'))
      const {data: res} = await this.$getApi('reports/type/1')
      this.options = {...this.options2,...res}
      myChart.setOption(this.options)
    }
  }
</script>

<style lang = 'less' scoped >
  #echars-table{
    width:600px;
    height:400px;
  }
</style>
