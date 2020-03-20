<template>
  <div class="container">
    <el-row type="flex" />
    <el-row>
      <el-col :span="12">    2020年1月200日 ｜  推送信息总视图</el-col>
      <el-col :span="12" align="right">

        <el-popover
          placement="bottom"
          title="数据自定义"
          trigger="click"
        >
          <el-row style="width: 500px">

            <el-col :span="8">消息推送渠道统计：</el-col>
            <el-col :span="16">
              <el-checkbox-group v-model="chartItemsL" @change="handleCheckedL">
                <el-checkbox label="1">推送总数</el-checkbox>
                <el-checkbox label="2">微信推送总数</el-checkbox>
                <el-checkbox label="3">APP推送总数</el-checkbox>
                <el-checkbox label="4">gocom推送总数</el-checkbox>
              </el-checkbox-group>
            </el-col>

          </el-row>
          <el-row style="width: 500px; margin-top: 20px">
            <el-col :span="8">消息推送类型统计：</el-col>
            <el-col :span="16">
              <el-checkbox-group v-model="optionR.yAxis.data" @change="handleCheckedR">
                <el-checkbox label="业务频道消息推送总数">业务频道消息推送总数</el-checkbox>
                <el-checkbox label="内容消息推送总数">内容消息推送总数</el-checkbox>
                <el-checkbox label="公告推送">公告推送</el-checkbox>
                <el-checkbox label="新闻推送">新闻推送</el-checkbox>
                <el-checkbox label="渠道消息推送总数">渠道消息推送总数</el-checkbox>
                <el-checkbox label="JIRA">JIRA</el-checkbox>
                <el-checkbox label="PDCA">PDCA</el-checkbox>
              </el-checkbox-group>
            </el-col>

          </el-row>
          <el-button slot="reference">首页数据自定义</el-button>
        </el-popover>

      </el-col>
    </el-row>

    <el-row class="chart">
      <el-col :span="12">
        <div id="homeChartL" />
      </el-col>
      <el-col :span="12">
        <div id="homeChartR" />
      </el-col>
    </el-row>
    <el-row :gutter="20" class="nav-link">
      <el-col :span="8">
        <h4>业务频道推送</h4>

        <p>step1: 初始化设置</p>
        <router-link :to="{path:'/source'}"> <el-tag>数据源</el-tag></router-link>
        <router-link :to="{path:'/data-tag'}"> <el-tag>标签分类</el-tag></router-link>
        <router-link :to="{path:'/business-channel'}"> <el-tag type="info">业务频道</el-tag></router-link>
        <router-link :to="{path:'/push-channel'}"> <el-tag>推送通道</el-tag></router-link>

        <p>step2: 设置业务频道推送</p>
        <router-link :to="{path:'/channel-push'}"> <el-tag>频道推送</el-tag></router-link>
        <p>step3: 完成推送</p>
        <router-link :to="{path:'/statistics/index'}"> <el-tag>推送统计</el-tag></router-link>

      </el-col>
      <el-col :span="8">
        <h4>内容推送</h4>
        <p>step1: 初始化设置</p>
        <router-link :to="{path:'/source'}"> <el-tag>数据源</el-tag></router-link>
        <router-link :to="{path:'/data-tag'}"> <el-tag type="info">标签分类</el-tag></router-link>
        <router-link :to="{path:'/push-content'}"> <el-tag type="danger">推送内容</el-tag></router-link>
        <router-link :to="{path:'/push-channel'}"> <el-tag type="warning">推送通道</el-tag></router-link>
        <p>step2: 设置内容推送规则</p>
        <router-link :to="{path:'/content-push'}"> <el-tag type="danger">内容推送</el-tag></router-link>
        <p>step3: 完成推送</p>
        <router-link :to="{path:'/statistics/index'}"> <el-tag>推送统计</el-tag></router-link>

      </el-col>
      <el-col :span="8">
        <h4>渠道推送</h4>
        <p>step1: 初始化设置</p>
        <router-link :to="{path:'/source'}"> <el-tag>数据源</el-tag></router-link>
        <router-link :to="{path:'/push-channel'}"> <el-tag type="warning">推送通道</el-tag></router-link>
        <p>step2: 设置渠道推送规则</p>
        <router-link :to="{path:'/pipe-push'}"> <el-tag effect="dark">渠道推送</el-tag></router-link>
        <p>step3: 完成推送</p>
        <router-link :to="{path:'/statistics/index'}"> <el-tag>推送统计</el-tag></router-link>
      </el-col>
    </el-row>
  </div>

</template>

<script>

import { mapGetters } from 'vuex'

import { chartData } from '@/api/dashboard'
// import { isExternal } from '@/utils/validate'
var echarts = require('echarts')
export default {
  name: 'Dashboard',

  data() {
    return {
      chartItemsL: [],
      chartItemsR: ['业务频道消息推送总数', '内容消息推送总数', '渠道消息推送总数', '公告推送', '新闻推送', 'JIRA', 'PDCA'],
      optionL: {
        title: {
          text: '消息推送渠道统计'
        },
        tooltip: {},
        legend: {
          data: ['推送数量']
        },
        xAxis: {
          // data: ['推送总数', '短信推送总数', '微信推送总数', 'APP推送总数', 'gocom推送总数']
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'pie',
          roseType: 'angle',
          radius: '55%',
          data: []
        }]
      },
      optionR: {
        title: {
          text: '消息推送类型统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['推送数量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['业务频道消息推送总数', '内容消息推送总数', '渠道消息推送总数', '公告推送', '新闻推送', 'JIRA', 'PDCA']
        },
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 10,
          max: 200,
          text: ['*', '.'],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ['rgb(255,174,172)', '#e14c01']
          }
        },
        series: [{
          name: '销量',
          type: 'bar',
          data: []
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    MODEL: function() {
      return this.$store.state.publicData.model
    },
    chartL() {
      return echarts.init(document.getElementById('homeChartL'))
    },
    chartR() {
      return echarts.init(document.getElementById('homeChartR'))
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleCheckedL() {
      this.chartL.setOption(this.optionL)
    },

    handleCheckedR() {
      this.chartR.setOption(this.optionR)
    },

    init() {
      console.log('init....')
      chartData().then(response => {
        this.optionL.series[0].data = response.data.series1
        this.optionR.series[0].data = response.data.series2
        this.chartL.setOption({ ...this.optionL })
        this.chartR.setOption(this.optionR)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  #homeChartL,#homeChartR{
    height: 400px;
  }
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.nav-link {
  h4{
    text-align: center;
  }
  p{
    /*font-weight: bold;*/
  }
}

</style>
