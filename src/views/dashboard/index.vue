<template>
  <div class="container">
    <el-row type="flex" />
    <el-row>
      <el-col :span="12">    2020年3月25日 ｜  推送信息总视图 </el-col>
      <el-col :span="12" align="right">

        <el-popover
          placement="bottom"
          title="数据自定义"
          trigger="click"
        >
          <el-row style="width: 500px">

            <el-col :span="8">消息推送通道统计：</el-col>
            <el-col :span="16">
              {{ checkL }}
              <el-checkbox-group v-model="checkL" @change="handleCheckedL">
                <el-checkbox v-for="item in chartItemsL" :key="item.id" :label="item.id">{{ item.title }}</el-checkbox>
              </el-checkbox-group>
            </el-col>

          </el-row>
          <el-row style="width: 500px; margin-top: 20px">
            <el-col :span="8">消息推送频道统计：</el-col>
            <el-col :span="16">
              {{ checkR }}
              <el-checkbox-group v-model="checkR" @change="handleCheckedR">
                <el-checkbox v-for="item in chartItemsR" :key="item.id" :label="item.id">{{ item.title }}</el-checkbox>
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

    <el-row>
      <el-col :span="4" align="center">
        <h4>业务频道推送</h4>
      </el-col>
      <el-col :span="20">
        <el-card class="box-card">
          <el-row>
            业务相关的各类数据的推送，平台与数据源对接，将使用主动拉取或推送到平台的数据，推送到指定通道。

          </el-row>
          <el-row>
            <el-col :span="8">
              <p>step1: 初始化设置</p>
              <router-link :to="{path:'/manage/source'}"> <el-tag>数据源</el-tag></router-link>
              <router-link :to="{path:'/manage/source'}"> <el-tag>数据标注</el-tag></router-link>
              <br>
              <router-link :to="{path:'/manage/category'}"> <el-tag>标签分类</el-tag></router-link>
              <router-link :to="{path:'/business-channel'}"> <el-tag type="info">业务频道</el-tag></router-link>
              <router-link :to="{path:'/manage/push-channel'}"> <el-tag>推送通道</el-tag></router-link>
            </el-col>
            <el-col :span="8">
              <p>step2: 设置业务频道推送</p>
              <router-link :to="{path:'/manage/channel-push'}"> <el-tag>消息推送</el-tag></router-link>
            </el-col>
            <el-col :span="8">
              <p>step3: 完成推送</p>
              <router-link :to="{path:'/permission/statistics'}"> <el-tag>推送统计</el-tag></router-link>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 10px">
      <el-col :span="4" align="center">
        <h4>内容推送</h4>
      </el-col>
      <el-col :span="20">
        <el-card class="box-card">
          <el-row>
            自定义内容，如新闻、公告等内容类型的消息推送。
          </el-row>
          <el-row>
            <el-col :span="8">

              <p>step1: 初始化设置</p>
              <router-link :to="{path:'/manage/source'}"> <el-tag>数据源</el-tag></router-link>
              <router-link :to="{path:'/manage/source'}"> <el-tag>数据标注</el-tag></router-link>
              <br>
              <router-link :to="{path:'/manage/category'}"> <el-tag type="info">标签分类</el-tag></router-link>
              <router-link :to="{path:'/business-channel'}"> <el-tag type="danger">推送内容</el-tag></router-link>
              <router-link :to="{path:'/manage/push-channel'}"> <el-tag type="warning">推送通道</el-tag></router-link>

            </el-col>
            <el-col :span="8">
              <p>step2: 设置内容推送规则</p>
              <router-link :to="{path:'/manage/channel-push'}"> <el-tag type="danger">消息推送</el-tag></router-link>
              <router-link :to="{path:'/content/push-content'}"> <el-tag type="danger">内容编辑</el-tag></router-link>
              <router-link :to="{path:'/content/examine-content'}"> <el-tag type="danger">内容审批</el-tag></router-link>
            </el-col>
            <el-col :span="8">
              <p>step3: 完成推送</p>
              <router-link :to="{path:'/permission/statistics'}"> <el-tag>推送统计</el-tag></router-link>
            </el-col>
          </el-row>
        </el-card>
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
      checkL: [],
      checkR: [],
      chartItemsL: [
        { id: 1, title: '推送总数', check: true },
        { id: 2, title: '推送总数' },
        { id: 3, title: '微信推送总数' },
        { id: 4, title: 'APP推送总数' },
        { id: 5, title: 'gocom推送总数' }
      ],
      chartItemsR: [
        { id: 1, title: '业务频道1' },
        { id: 2, title: '业务频道1' },
        { id: 3, title: '业务频道1' }
      ],
      optionL: {
        title: {
          text: '消息推送渠道统计'
        },
        tooltip: {},
        legend: {
          data: ['推送数量']
        },
        // xAxis: {
        //   // data: ['推送总数', '短信推送总数', '微信推送总数', 'APP推送总数', 'gocom推送总数']
        // },
        // yAxis: {},
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
    init() {
      this.getConfig()
    },
    handleCheckedL() {
      this.chartL.setOption(this.optionL)
    },

    handleCheckedR() {
      this.chartR.setOption(this.optionR)
    },

    getConfig() {
      this.getData()
    },
    getData() {
      chartData().then(response => {
        this.optionL.series[0].data = response.data.series1
        this.optionR.series[0].data = response.data.series2
        this.optionR.yAxis.data = []
        this.optionR.series[0].data.forEach(item => {
          // console.log(item.name)
          this.optionR.yAxis.data.push(item.name)
        })
        this.chartL.setOption({ ...this.optionL })
        this.chartR.setOption(this.optionR)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag{
  margin-top: 5px;
}
  .info{
    font-size: 14px;
    padding: 10px;
  }

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
