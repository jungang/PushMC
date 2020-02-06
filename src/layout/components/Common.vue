<template>
  <section class="common" />
</template>

<script>

import { mapGetters } from 'vuex'
import { sourceOption } from '@/api/common'
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
      this.getDataSourceModel() // 取基础数据源类型
    },
    getDataSourceModel() {
      sourceOption().then(response => {
        try {
          this.$store.state.publicData.model = response.data
        } catch (err) {
          console.log('err', err)
        }
      })
    }
  }
}
</script>
