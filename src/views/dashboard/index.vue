<template>
  <div class="container">
    <el-row type="flex" />
    <el-row>
      <el-col :span="12">    2020年1月20日 ｜  推送信息总视图</el-col>
      <el-col :span="12" align="right"><el-button type="primary"> 首页数据自定义 </el-button></el-col>
    </el-row>

    <el-row>
      地图
      <div id="map" />
    </el-row>

  </div>

</template>

<script>

import { mapGetters } from 'vuex'
import BMap from 'BMap'

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
    ])
  },
  mounted() {
    this.createMap()
  },
  methods: {
    createMap() {
      // 百度地图API功能
      var map = new BMap.Map('map')
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 5)
      map.enableScrollWheelZoom()

      var MAX = 10
      var markers = []
      var pt = null
      var i = 0
      for (; i < MAX; i++) {
        pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21)
        markers.push(new BMap.Marker(pt))
      }
      // var markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers })
    }

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

#map {
  width: 100%;
  height: 60vh;
}

</style>
