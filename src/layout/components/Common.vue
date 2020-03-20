<template>
  <section class="common" />
</template>

<script>

import { mapGetters } from 'vuex'
import { options } from '@/api/common'
export default {
  name: 'Common',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    MODEL: function() {
      return this.$store.state.publicData.model
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getUploadUrl()
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
