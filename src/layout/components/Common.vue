<template>
  <section class="common" />
</template>

<script>

import { mapGetters } from 'vuex'
import { options } from '@/api/common'
export default {
  name: 'Common',
  data() {
    return {
      urlError: false
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
    sysError() {
      return this.$store.state.user.sysError
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getUploadUrl()
      console.log('sysError', this.$store.state.user.sysError)
      this.$nextTick(() => {
        const info_channel = document.querySelector('#channel')
        const info_push_channel = document.querySelector('#push_channel')
        const info_target = document.querySelector('#target')
        info_channel.style.display = this.sysError.channel ? 'inline-block' : 'none'
        info_push_channel.style.display = this.sysError.push_channel ? 'inline-block' : 'none'
        info_target.style.display = this.sysError.target ? 'inline-block' : 'none'
      })
    },
    getUploadUrl() {
      options().then(res => {
        this.MODEL.nginxPath = res.data.nginxPath
        this.MODEL.argu = res.data.argu
        this.MODEL.dataSourceTypeOptions = res.data.dataSourceTypeOptions
      })
    }
  }
}
</script>

<style lang="scss">
.action_btn{
        color: red;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-table .cell{
  font-size: 14px;
  color: #606266;
}
  .el-table th>.cell{
    font-size: 14px;
    font-weight: bold;
    color: #606266;
  }
.el-button--text{
  color:#606266;
}
.el-button--text:focus, .el-button--text:hover{
  color:#606266;
}
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
