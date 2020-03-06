<template>
  <div class="container">
    <el-row type="flex" />
    <el-row>
      <el-col :span="12">    2020年1月20日 ｜  推送信息总视图</el-col>
      <el-col :span="12" align="right"><el-button type="primary"> 首页数据自定义 </el-button></el-col>
    </el-row>

    <el-row>
      <p>数据图表</p>
    </el-row>
    <el-row :gutter="20" class="nav-link">
      <el-col :span="8">
        <h4>业务频道推送</h4>

        <p>step1: 初始化设置</p>
        <router-link :to="{path:'/data-tag'}"> <el-tag>标签分类</el-tag></router-link>
        <router-link :to="{path:'/business-channel'}"> <el-tag type="info">业务频道</el-tag></router-link>
        <router-link :to="{path:'/push-channel'}"> <el-tag>推送通道</el-tag></router-link>

        <p>step2: 设置业务频道推送</p>
        <router-link :to="{path:'/message-push/channel-push'}"> <el-tag>频道推送</el-tag></router-link>
        <p>step3: 完成推送</p>
        <router-link :to="{path:'/message-push/channel-push'}"> <el-tag>推送统计</el-tag></router-link>

      </el-col>
      <el-col :span="8">
        <h4>内容推送</h4>
        <p>step1: 初始化设置</p>
        <router-link :to="{path:'/data-tag'}"> <el-tag type="info">标签分类</el-tag></router-link>
        <router-link :to="{path:'/push-content'}"> <el-tag type="danger">推送内容</el-tag></router-link>
        <router-link :to="{path:'/push-channel'}"> <el-tag type="warning">推送通道</el-tag></router-link>
        <p>step2: 设置内容推送规则</p>
        <el-tag type="warning">内容推送</el-tag>
        <p>step3: 完成推送</p>
        <router-link :to="{path:'/message-push/channel-push'}"> <el-tag>推送统计</el-tag></router-link>

      </el-col>
      <el-col :span="8">
        <h4>渠道推送</h4>
        <p>step1: 初始化设置</p>
        <router-link :to="{path:'/push-channel'}"> <el-tag type="warning">推送通道</el-tag></router-link>
        <p>step2: 设置渠道推送规则</p>
        <router-link :to="{path:'/message-push/pipe-push'}"> <el-tag effect="dark">渠道推送</el-tag></router-link>
        <p>step3: 完成推送</p>
        <router-link :to="{path:'/message-push/channel-push'}"> <el-tag type="danger">推送统计</el-tag></router-link>

      </el-col>
    </el-row>
  </div>

</template>

<script>

import { mapGetters } from 'vuex'
// import BMap from 'BMap'

export default {
  name: 'Dashboard',

  data() {
    return {
      mapArr: {
        lat: 113.119538,
        lng: 23.029158
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
    }
  },
  mounted() {
    // this.createMap()
  },
  methods: {
    // createMap() {
    //   // 百度地图API功能
    //   var map = new BMap.Map('map')
    //   map.centerAndZoom(new BMap.Point(116.404, 39.915), 5)
    //   map.enableScrollWheelZoom()
    //
    //   var MAX = 10
    //   var markers = []
    //   var pt = null
    //   var i = 0
    //   for (; i < MAX; i++) {
    //     pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21)
    //     markers.push(new BMap.Marker(pt))
    //   }
    //   // var markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers })
    // }

  }
}
</script>

<style lang="scss" scoped>
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
